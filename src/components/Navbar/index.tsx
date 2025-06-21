import { getUserByTokenClient } from "@/server/services/user";
import { cookies } from "next/headers";
import Link from "next/link";
import { ModeToggle } from "../ModeToggle";
import UserDropDownMenu from "../AuthForm/UserDropDownMenu";

const Navbar = async () => {
  const cookie = cookies();
  const tokenUser = (await (await cookie).get("user_token")?.value) as string;
  const { user } = await getUserByTokenClient(tokenUser);

  return (
    <header className="flex justify-between items-center w-full p-4 border-b border-zinc-500">
      <Link href={"/"} className="text-2xl font-semibold">
        Project Management Web
      </Link>
      <nav className="flex gap-4 w-fit">
        {!tokenUser ? (
          <div className="flex gap-4">
            <Link
              href="/login"
              className="text-blue-700 dark:text-blue-400 hover:underline"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="text-blue-700 dark:text-blue-400 hover:underline"
            >
              Daftar
            </Link>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="text-blue-700 dark:text-blue-400 hover:underline"
            >
              Dashboard
            </Link>
            <Link
              href="/projects"
              className="text-blue-700 dark:text-blue-400 hover:underline"
            >
              Projects
            </Link>
            <span>{user?.email}</span>
            <UserDropDownMenu/>
          </div>
        )}
        <ModeToggle />
      </nav>
    </header>
  );
};

export default Navbar;
