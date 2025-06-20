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
            Masuk
          </Link>
          <Link
            href="/register"
            className="text-blue-700 dark:text-blue-400 hover:underline"
          >
            Daftar
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
        <h1 className="text-6xl font-bold">Aplikasi Web Manajemen Proyek</h1>
        <p className="text-2xl p-4">
          Aplikasi web manajemen proyek full-stack yang dibangun dengan Next.js,
          TypeScript, Tailwind CSS, dan Prisma.
        </p>
        <p className="mt-4">
          Fitur termasuk autentikasi pengguna, pembuatan dan manajemen proyek,
          penugasan tugas, dan komentar waktu nyata.
        </p>
        <p className="mt-4">
          Cobalah dengan{" "}
          <Link
            href="/login"
            className="text-blue-700 dark:text-blue-400 hover:underline"
          >
            masuk
          </Link>
          .
        </p>
      </main>
    </div>
  );
};

export default Page;
