import Project from "@/components/Project";
import SingleProject from "@/components/Project/SingleProject";
import prisma from "@/lib/prisma";
import { loggedInUser } from "@/server/actions";
import { ProjectWithUserAndMemberships } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Management | Dashboard",
  description: "Multi-User Project Management App",
};

const Page = async () => {
  const { user, userId } = await loggedInUser();
  const projects = (await prisma.project.findMany({
    where: {
      OR: [{ ownerId: userId }, { memberships: { some: { userId } } }],
    },
    include: {
      owner: { select: { email: true } },
      memberships: {
        include: { user: { select: { email: true } } },
      },
      tasks: {
        include: {
          project: {
            select: {
              _count: true,
              name: true,
              owner: { select: { email: true } },
              memberships: { include: { user: { select: { email: true } } } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })) as ProjectWithUserAndMemberships[];

  const allUsers = await prisma.user.findMany();

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex">
        <Project projects={projects} />
        <SingleProject currentUserID={userId} user={user} allUsers={allUsers} />
      </div>
    </div>
  );
};

export default Page;
