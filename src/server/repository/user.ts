import { User } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export const emailUserRepository = async (email: string) => {
    const user = await prisma.user.findFirst({
        where: { email },
    });
    return user;
};

export const registerUserRepository = async (data: User) => {
    const { email, password } = data
    const user = await prisma.user.create({ data: { email, password } });
    return user;
};
export const getUserByEmailRepository = async (email: string) => {
    const user = await prisma.user.findFirst({ where: { email } });
    return user;
};

export const getUserByIdRepository = async (id: string) => {
  const user = await prisma.user.findFirst({ where: { id } });
  return user;
};