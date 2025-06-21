import ProjectDetails from "@/components/Project/ProjectDetails";
import prisma from "@/lib/prisma";
import { TaskWithProjectInfo } from "@/types";
interface Props {
  params: Promise<{ id: string }>;
}
const Page = async (props: Props) => {
  const { id } = await props.params;
  const tasks = (await prisma.task.findMany({
    where: { projectId: id },
    include: {
      project: {
        select: {
          _count: true,
          name: true,
          owner: { select: { email: true } },
          memberships: { include: { project: { select: { _count: true } } } },
        },
      },
    },
  })) as TaskWithProjectInfo[];
  return (
    <main className="flex flex-col gap-6">
      <ProjectDetails tasks={tasks} />
    </main>
  );
};

export default Page;
