import UserDropDownMenu from "@/components/AuthForm/UserDropDownMenu";
import { ModeToggle } from "@/components/ModeToggle";
import Project from "@/components/Project";
import SingleProject from "@/components/Project/SingleProject";
import prisma from "@/lib/prisma";
import { loggedInUser } from "@/server/actions";
import { ProjectWithUser } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Management | Dashboard",
  description: "Multi-User Project Management App",
};

const Page = async () => {
  const { user, userId } = await loggedInUser();
  const projects = await prisma.project.findMany({
    where: {
      OR: [{ ownerId: userId }, { memberships: { every: { userId } } }],
    },
    include: {
      owner: { select: { email: true } },
      memberships: {
        select: { user: { select: { email: true, _count: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  }) as ProjectWithUser[];

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b border-zinc-400/50 px-4 py-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Project Management Dashboard</h1>
        <nav className="flex gap-4">
          <ModeToggle />
          <div className="flex gap-3 items-center">
            <span>{user.email}</span>
            <UserDropDownMenu />
          </div>
        </nav>
      </header>
      <div className="flex-1 flex">
        <Project projects={projects} />
        <SingleProject />
      </div>
    </div>
  );
};

export default Page;
