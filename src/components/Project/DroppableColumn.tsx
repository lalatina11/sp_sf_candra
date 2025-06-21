"use client";

import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

interface Props {
  id: string;
  children: ReactNode;
}

const DroppableColumn = ({ id, children }: Props) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { status: id },
  });

  return (
    <div
      ref={setNodeRef}
      className={`transition-colors duration-200 ${
        isOver ? "bg-zinc-200 dark:bg-zinc-700" : ""
      }`}
    >
      {children}
    </div>
  );
};

export default DroppableColumn;
