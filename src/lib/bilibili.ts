import crypto from 'crypto';

// ==========================================
// Wbi Signature Utilities
// Reference: https://github.com/SocialSisterYi/bilibili-API-collect
// ==========================================

const MIXIN_KEY_ENC_TAB = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
  33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
  61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
  36, 20, 34, 44, 52
];

function getMixinKey(orig: string): string {
  return MIXIN_KEY_ENC_TAB.map(n => orig[n]).join('').slice(0, 32);
}

function encWbi(params: Record<string, string | number>, img_key: string, sub_key: string) {
  const mixin_key = getMixinKey(img_key + sub_key);
  const curr_time = Math.round(Date.now() / 1000);
  const chr_filter = /[!'()*]/g;

  // Add timestamp
  const newParams = { ...params, wts: curr_time };
  
  // Sort and filter keys
  const query = Object.keys(newParams)
    .sort()
    .map(key => {
      const value = newParams[key as keyof typeof newParams].toString().replace(chr_filter, '');
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');

  // Calculate hash
  const w_rid = crypto
    .createHash('md5')
    .update(query + mixin_key)
    .digest('hex');

  return query + '&w_rid=' + w_rid;
}

async function getWbiKeys(headers: Record<string, string>) {
  const res = await fetch('https://api.bilibili.com/x/web-interface/nav', {
    headers: {
        ...headers,
    },
    cache: 'no-store' 
  });
  
  if (!res.ok) {
      throw new Error(`Failed to fetch nav info for keys: ${res.statusText}`);
  }

  const json = await res.json();
  
  const img_url = json.data?.wbi_img?.img_url;
  const sub_url = json.data?.wbi_img?.sub_url;
  
  if (!img_url || !sub_url) {
      // Fallback keys if API fails (rarely happens but safe to have)
      return { 
          img_key: '7cd084941338484aae1ad9425b84077c', 
          sub_key: '4932caff0a9246c7bf596efd4a85f7b1' 
      };
  }

  const img_key = img_url.substring(img_url.lastIndexOf('/') + 1, img_url.lastIndexOf('.'));
  const sub_key = sub_url.substring(sub_url.lastIndexOf('/') + 1, sub_url.lastIndexOf('.'));
  
  return { img_key, sub_key };
}

// ==========================================
// Main Function
// ==========================================

export async function getBilibiliSubtitles(url: string): Promise<string> {
  try {
    // 1. Extract BVID and Page Number
    const bvidMatch = url.match(/BV[a-zA-Z0-9]+/);
    if (!bvidMatch) {
      throw new Error("Invalid Bilibili URL: BVID not found");
    }
    const bvid = bvidMatch[0];
    
    const pageMatch = url.match(/[?&]p=(\d+)/);
    const pageNumber = pageMatch ? parseInt(pageMatch[1], 10) : 1;

    // Standard headers to mimic browser
    const headers: Record<string, string> = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.bilibili.com',
    };
    if (process.env.BILIBILI_SESSDATA) {
        headers['Cookie'] = `SESSDATA=${process.env.BILIBILI_SESSDATA}`;
    }

    // 2. Get Video CID (using pagelist for accuracy)
    const pageListResponse = await fetch(`https://api.bilibili.com/x/player/pagelist?bvid=${bvid}&t=${Date.now()}`, {
       headers,
       cache: 'no-store'
    });

    if (!pageListResponse.ok) {
        throw new Error(`Failed to fetch pagelist: ${pageListResponse.statusText}`);
    }

    const pageListData = await pageListResponse.json();
    if (pageListData.code !== 0) {
        throw new Error(`Bilibili API Error (pagelist): ${pageListData.message}`);
    }

    // Find CID for specific page
    let cid = 0;
    let partTitle = "";
    const pages = pageListData.data;
    const targetPage = pages.find((p: any) => p.page === pageNumber);
    
    if (targetPage) {
        cid = targetPage.cid;
        partTitle = targetPage.part;
    } else {
        cid = pages[0].cid;
        partTitle = pages[0].part;
    }

    // 3. Get Video Title & Desc (for context)
    const viewResponse = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}&t=${Date.now()}`, {
      headers,
      cache: 'no-store'
    });
    const viewData = await viewResponse.json();
    const title = viewData.data?.title || "Unknown Title";
    const desc = viewData.data?.desc || "";
    const fullTitle = partTitle ? `${title} - ${partTitle}` : title;

    // 4. Get Subtitle Info (using WBI signature)
    const { img_key, sub_key } = await getWbiKeys(headers);
    const params = { bvid, cid };
    const query = encWbi(params, img_key, sub_key);
    
    const playerUrl = `https://api.bilibili.com/x/player/wbi/v2?${query}`;

    const playerResponse = await fetch(playerUrl, {
      headers,
      cache: 'no-store'
    });

    if (!playerResponse.ok) {
        throw new Error(`Failed to fetch player info: ${playerResponse.statusText}`);
    }

    const playerData = await playerResponse.json();
    
    // If API error or no subtitles, return just title/desc
    if (playerData.code !== 0 || !playerData.data.subtitle?.subtitles?.length) {
       console.warn(`No subtitles found or API error: ${playerData.message || 'Empty list'}`);
       return `Title: ${fullTitle}\n\nDescription: ${desc}`;
    }

    const subtitles = playerData.data.subtitle.subtitles;

    // Priority list for Chinese subtitles
    const subtitle = subtitles.find((s: any) => s.lan === 'zh-CN') || 
                     subtitles.find((s: any) => s.lan === 'ai-zh') || 
                     subtitles[0];
                     
    const subtitleUrl = subtitle.subtitle_url;

    if (!subtitleUrl) {
         return `Title: ${fullTitle}\n\nDescription: ${desc}`;
    }

    // 5. Fetch Subtitle Content
    const finalSubtitleUrl = subtitleUrl.startsWith('//') ? `https:${subtitleUrl}` : subtitleUrl;
    
    // Add random param to prevent CDN caching
    const urlObj = new URL(finalSubtitleUrl);
    urlObj.searchParams.append('t', Date.now().toString());
    const noCacheUrl = urlObj.toString();

    const subResponse = await fetch(noCacheUrl, { cache: 'no-store' });
    if (!subResponse.ok) {
        throw new Error(`Failed to fetch subtitle content`);
    }

    const subData = await subResponse.json();
    const transcript = subData.body.map((item: any) => item.content).join('\n');

    return `Title: ${fullTitle}\n\nDescription: ${desc}\n\nTranscript:\n${transcript}`;

  } catch (error) {
    console.error("Error fetching Bilibili subtitles:", error);
    throw error;
  }
}
