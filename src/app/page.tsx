import Link from "next/link";

const Page = async () => {
  return (
    <div>
      
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
