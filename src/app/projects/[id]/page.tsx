import KanbanDND from "@/components/Project/KanbanDND";
import prisma from "@/lib/prisma";
import { TaskWithProjectInfo } from "@/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Project Management | Project",
  description: "Multi-User Project Management App",
};

const Page = async (props: Props) => {
  const { id } = await props.params;

  const existingProject = await prisma.project.findUnique({ where: { id } });
  const tasks = (await prisma.task.findMany({
    where: { projectId: existingProject?.id },
  })) as TaskWithProjectInfo[];

  return (
    <main className="flex flex-col gap-6">
      {existingProject ? (
        <KanbanDND projectId={id} tasks={tasks} />
      ) : (
        notFound()
      )}
    </main>
  );
};

export default Page;
