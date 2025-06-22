import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { loggedInUser } from "@/server/actions";
import { ProjectWithUserAndMembershipsCount } from "@/types";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Project Management | Dashboard",
  description: "Multi-User Project Management App",
};

const Page = async () => {
  const { userId } = await loggedInUser();
  const projects = (await prisma.project.findMany({
    where: {
      OR: [{ ownerId: userId }, { memberships: { some: { userId } } }],
    },
    include: {
      owner: { select: { email: true } },
      memberships: {
        include: { user: { select: { _count: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  })) as ProjectWithUserAndMembershipsCount[];

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <Link
        className={"" + buttonVariants({ variant: "default" })}
        href={"/projects"}
      >
        Tambahkan Project
      </Link>
      {projects.length ? (
        projects.map((project) => (
          <div
            key={project.id}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <Link href={`/projects/${project.id}`}>
              <Card>
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Created by: {project.owner.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    Members: {project.memberships.length}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        ))
      ) : (
        <div className="flex w-full flex-col gap-3 items-center justify-center">
          <span className="text-sm text-zinc-500">
            Anda Belum memiliki Project
          </span>
        </div>
      )}
    </div>
  );
};

export default Page;
