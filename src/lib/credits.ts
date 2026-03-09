import db from "@/lib/db";

export const INITIAL_CREDITS = 20;

export async function getUserCredits(userId: string) {
  let userCredit = await db.userCredit.findUnique({
    where: { userId },
  });

  // 如果用户不存在积分记录，初始化默认积分
  if (!userCredit) {
    userCredit = await db.userCredit.create({
      data: {
        userId,
        balance: INITIAL_CREDITS,
      },
    });
  }

  return userCredit;
}

export async function deductCredit(userId: string, amount: number = 1) {
  const userCredit = await getUserCredits(userId);

  if (userCredit.balance < amount) {
    throw new Error("Insufficient credits");
  }

  return await db.userCredit.update({
    where: { userId },
    data: {
      balance: {
        decrement: amount,
      },
    },
  });
}

export async function addCredit(userId: string, amount: number) {
  // 确保记录存在
  await getUserCredits(userId);

  return await db.userCredit.update({
    where: { userId },
    data: {
      balance: {
        increment: amount,
      },
    },
  });
}
