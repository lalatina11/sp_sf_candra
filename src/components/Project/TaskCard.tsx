"use client";

import { TaskWithProjectInfo } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  task: TaskWithProjectInfo;
  status: string;
}

const TaskCard = (props: Props) => {
  const { task } = props;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id, data: { status: task.status } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };



  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white dark:bg-zinc-800 border rounded shadow gap-3 p-3 mb-2 cursor-grab relative"
    >
      <p className="font-medium">{task.title}</p>
      <p className="text-sm text-zinc-500 mt-1">{task.description}</p>
      <div className="relative z-10 flex justify-center gap-5 items-center mt-3">

      </div>
    </div>
  );
};

export default TaskCard;
