import { User } from "@/generated/prisma";
import { compareSync, hashSync } from 'bcrypt-ts';
import jwt, { JwtPayload } from "jsonwebtoken";
import { emailUserRepository, getUserByEmailRepository, getUserByIdRepository, registerUserRepository } from "../repository/user";

export const checkUserService = async (
  email: string,
  password: string
) => {
  const user = await emailUserRepository(email);
  if (!user) {
    throw new Error("Invalid Email or Username");
  }

  if (!user.password) {
    throw new Error(
      "Anda telah mendaftar tanpa menggunakan password,\nsilahkan masuk menggunakan google atau github!"
    );
  }

  const validatePassword = compareSync(password, user.password);

  if (!validatePassword) {
    throw new Error("Invalid Password");
  }

  const { id } = user;

  const token = jwt.sign({ id }, process.env.SECRET_KEY || "".toString(), {
    expiresIn: "7d",
  });

  return { token };
};

export const registerUserService = async (data: User) => {
  const emailExist = await getUserByEmailRepository(data.email);
  if (emailExist) {
    throw new Error("Email already used!");
  }
  if (!data.password) {
    throw new Error("Password harus diisi minimal 6 karakter");
  }
  const hashedPassword = hashSync(data.password, 12);

  data.password = hashedPassword;

  const user = await registerUserRepository(data);
  return user;
};

export const getUserByToken = async (token?: string) => {
  if (!token) {
    throw new Error("You are not authorized!");
  }
  const decodeToken = jwt.verify(
    token,
    process.env.SECRET_KEY || "".toString()
  ) as JwtPayload;

  const user = await getUserByIdRepository(decodeToken?.id);

  return { user };
}
