import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { loggedInUser } from "@/server/actions";
import { ProjectWithUserAndMembershipsCount } from "@/types";
import Link from "next/link";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Link href={`/projects/${project.id}`} key={project.id}>
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
        ))}
      </div>
    </div>
  );
};

export default Page;
