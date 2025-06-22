import KanbanDND from "@/components/Project/KanbanDND";
import prisma from "@/lib/prisma";
import { TaskWithProjectInfo } from "@/types";
import { Metadata } from "next";
interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Project Management | Project",
  description: "Multi-User Project Management App",
};

const Page = async (props: Props) => {
  const { id } = await props.params;
  const tasks = (await prisma.task.findMany({
    where: { projectId: id },
  })) as TaskWithProjectInfo[];

  console.log(tasks);

  return (
    <main className="flex flex-col gap-6">
      <KanbanDND projectId={id} tasks={tasks} />
    </main>
  );
};

export default Page;
