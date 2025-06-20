"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
interface Props {
  type: "login" | "register";
}

const AuthForm = (props: Props) => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  return (
    <form className="space-y-4">
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
      <Button type="submit" className="w-full text-center">
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
