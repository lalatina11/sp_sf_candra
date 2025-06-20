import { ModeToggle } from "@/components/ModeToggle";
import Link from "next/link";

const Page = async () => {
  return (
    <div suppressHydrationWarning>
      <header className="flex justify-between items-center w-full p-4 border-b border-zinc-500">
        <h1 className="text-2xl font-semibold">Project Management Web</h1>
        <nav className="flex gap-4">
          <Link
            href="/login"
            className="text-blue-700 dark:text-blue-400 hover:underline"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-blue-700 dark:text-blue-400 hover:underline"
          >
            Register
          </Link>
          <Link
            href="/dashboard"
            className="text-blue-700 dark:text-blue-400 hover:underline"
          >
            Dashboard
          </Link>
        </nav>
        <ModeToggle />{" "}
      </header>
      <main className="flex flex-col items-center justify-center min-h-screen p-4 gap-6">
        <h1 className="text-6xl font-bold">Project Management Web App</h1>
        <p className="text-2xl">
          A full-stack project management web app built with Next.js,
          TypeScript, Tailwind CSS, and Prisma.
        </p>
        <p className="mt-4">
          Features include user authentication, project creation and management,
          task assignment, and real-time commenting.
        </p>
        <p className="mt-4">
          Try it out by{" "}
          <Link
            href="/login"
            className="text-blue-700 dark:text-blue-400 hover:underline"
          >
            logging in
          </Link>
          .
        </p>
      </main>
    </div>
  );
};

export default Page;
