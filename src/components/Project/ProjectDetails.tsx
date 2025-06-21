"use client";

import { useEffect, useState } from "react";
import { TaskWithProjectInfo } from "@/types";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Task } from "@/generated/prisma";
import { Button } from "../ui/button";

interface Props {
  tasks: TaskWithProjectInfo[];
}

const statuses = ["TODO", "IN_PROGRESS", "DONE"];

const ProjectDetails = (props: Props) => {
  const { tasks: initialTasks } = props;
  const [tasks, setTasks] = useState<TaskWithProjectInfo[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTasks(initialTasks);
    setMounted(true);
  }, [initialTasks]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (destination.droppableId !== source.droppableId) {
      const updatedTasks = tasks.map((task) =>
        task.id === draggableId
          ? { ...task, status: destination.droppableId as Task["status"] }
          : task
      );
      setTasks(updatedTasks); // optimistic update

      // Call backend to persist change
      await fetch(`/api/tasks/${draggableId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: destination.droppableId }),
      });
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-4">
      <Button className="w-fit mt-2">Add Task</Button>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 w-full">
          {statuses.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex-1 bg-zinc-100 dark:bg-zinc-900 p-4 rounded-md min-h-[200px]"
                >
                  <h2 className="text-xl font-semibold mb-4">{status}</h2>
                  {tasks
                    .filter((task) => task.status === status)
                    .map((task, index) => (
                      <Draggable
                        draggableId={task.id}
                        index={index}
                        key={task.id}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white dark:bg-zinc-800 border rounded shadow p-3 mb-2"
                          >
                            <p className="font-medium">{task.title}</p>
                            {task.description && (
                              <p className="text-sm text-zinc-500 mt-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default ProjectDetails;
