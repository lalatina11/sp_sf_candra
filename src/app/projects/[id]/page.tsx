import ProjectDetails from "@/components/Project/ProjectDetails";
import prisma from "@/lib/prisma";
import { TaskWithProjectInfo } from "@/types";
import { notFound } from "next/navigation";
interface Props {
  params: Promise<{ id: string }>;
}

const Page = async (props: Props) => {
  const { id } = await props.params;
  const tasks = (await prisma.task.findMany({
    where: { projectId: id },
  })) as TaskWithProjectInfo[];
  return (
    <main className="flex flex-col gap-6">
      {tasks.length ? <ProjectDetails projectId={id} tasks={tasks} /> : notFound()}
    </main>
  );
};

export default Page;
