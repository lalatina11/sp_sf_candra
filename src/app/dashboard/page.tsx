import UserDropDownMenu from "@/components/AuthForm/UserDropDownMenu";
import { ModeToggle } from "@/components/ModeToggle";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Project Management | Login",
  description: "Multi-User Project Management App",
};

const Page = () => {
  return (
    <div className="h-screen flex flex-col">
      <header className="border-b border-zinc-400/50 px-4 py-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Project Management Dashboard</h1>
        <nav className="flex gap-4">
          <ModeToggle />
          <UserDropDownMenu />
        </nav>
      </header>
      <div className="flex-1 flex">
        <aside className="w-64 border-r border-zinc-400/50 p-4">
          <h2 className="text-lg font-semibold mb-2">Menu</h2>
          <ul>
            <li className="mb-1">
              <Link
                href="/dashboard/projects"
                className="text-blue-700 dark:text-blue-400 hover:underline"
              >
                Projects
              </Link>
            </li>
            <li className="mb-1">
              <Link
                href="/dashboard/users"
                className="text-blue-700 dark:text-blue-400 hover:underline"
              >
                Users
              </Link>
            </li>
          </ul>
        </aside>
        <main className="flex-1 p-4"></main>
      </div>
    </div>
  );
};

export default Page;
