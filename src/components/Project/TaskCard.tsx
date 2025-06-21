"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskWithProjectInfo } from "@/types";

interface Props {
  task: TaskWithProjectInfo;
  status: string;
}

const TaskCard = ({ task }: Props) => {
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
      className="bg-white dark:bg-zinc-800 border rounded shadow p-3 mb-2 cursor-grab"
    >
      <p className="font-medium">{task.title}</p>
      {task.description && (
        <p className="text-sm text-zinc-500 mt-1">{task.description}</p>
      )}
    </div>
  );
};

export default TaskCard;
