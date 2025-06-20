"use client";
import Link from "next/link";
import { FormEventHandler, useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { apiRequest } from "@/lib/apiRequest";
import { toast } from "sonner";
import { User } from "@/generated/prisma";
import { useRouter } from "next/navigation";
import emailValidator from "email-validator";
interface Props {
  type: "login" | "register";
}

const AuthForm = (props: Props) => {
  const { push } = useRouter();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleForm: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (props.type === "register") {
      try {
        setIsLoading(true);
        const { email, password } = Object.fromEntries(
          new FormData(form).entries()
        ) as User;
        const body = { email, password };
        if (email.trim().length < 6) {
          throw new Error("Email minimal 6 karakter!");
        }
        if (!emailValidator.validate(email)) {
          throw new Error("Email tidak valid!");
        }
        if (password.trim().length < 6) {
          throw new Error("Password minimal 6 karakter!");
        }
        const { res } = await apiRequest.post("/api/register", body);
        const result = await res.json();
        if (!res.ok || result.error) {
          throw new Error(result.message);
        }
        toast("registrasi berhasil!");
        return setTimeout(() => {
          push("/login");
        }, 300);
      } catch (error) {
        toast((error as Error).message);
        setIsLoading(false);
      }
    }
  };
  return (
    <form onSubmit={handleForm} className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold" htmlFor="email">
          Email
        </label>
        <Input type="email" id="email" name="email" placeholder="email" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold" htmlFor="password">
          Password
        </label>
        <Input
          type={isShowPassword ? "text" : "password"}
          name="password"
          placeholder="password"
          id="password"
        />
      </div>
      <div className="flex gap-2 items-center">
        <Checkbox
          id="showPass"
          onCheckedChange={(checked) => setIsShowPassword(!!checked)}
        />
        <label
          className="text-sm font-semibold text-zinc-500"
          htmlFor="showPass"
        >
          Show password
        </label>
      </div>
      <Button disabled={isLoading} type="submit" className="w-full text-center">
        {props.type === "login" ? "Login" : "Register"}
      </Button>
      {props.type === "login" ? (
        <span className="text-sm">
          Don&apos;t have an account?
          <Link href="/register" className="text-blue-700 dark:text-blue-400">
            Register Here
          </Link>
        </span>
      ) : (
        <span className="text-sm">
          Already have an account?
          <Link href="/login" className="text-blue-700 dark:text-blue-400">
            Login Here
          </Link>
        </span>
      )}
    </form>
  );
};

export default AuthForm;
