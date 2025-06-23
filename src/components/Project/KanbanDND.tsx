"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormEventHandler, useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskWithProjectInfo } from "@/types";
import { Task } from "@/generated/prisma";
import TaskCard from "./TaskCard";
import DroppableColumn from "./DroppableColumn";
import BackButton from "../BackButton";
import { toast } from "sonner";
import { apiRequest } from "@/lib/apiRequest";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SelectViewport } from "@radix-ui/react-select";

interface Props {
  tasks: TaskWithProjectInfo[];
  projectId: string;
}

const statuses = ["TODO", "IN_PROGRESS", "DONE"] as const;

const KanbanDND = (props: Props) => {
  const { tasks: initialTasks, projectId } = props;
  const [tasks, setTasks] = useState<TaskWithProjectInfo[]>([]);
  const [isFormDialogAddTaskOpen, setIsFormDialogAddTaskOpen] = useState(false);
  const [isFormDialogAddTaskLoading, setisFormDialogAddTaskLoading] =
    useState(false);
  const initializeTask: Task = {
    title: "",
    description: "",
    id: "",
    status: "TODO",
    assigneeId: "",
    createdAt: new Date(),
    projectId: "",
    updatedAt: new Date(Date.now()),
  };
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false);
  const [isDeleteTaskDialogOpen, setIsDeleteTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task>(initializeTask);
  const [editTaskStep, setEditTaskStep] = useState(1);
  const [isUpating, setIsUpating] = useState({ delete: false, update: false });

  const openEditDialog = () => setIsEditTaskDialogOpen(true);
  const openDeleteDialog = () => setIsDeleteTaskDialogOpen(true);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    try {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      const activeTask = tasks.find((task) => task.id === active.id);
      if (!activeTask) return;

      const newStatus = over.data.current?.status as Task["status"];
      if (!newStatus || activeTask.status === newStatus) return;

      const updatedTasks = tasks.map((task) =>
        task.id === active.id ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);
      const body = { status: newStatus };
      await apiRequest.update(`/api/tasks/${active.id}`, body);
      toast.success(`Task Berhasil dipindahkan ke ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengupdate task");
    }
  };

  const addTask: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    try {
      setisFormDialogAddTaskLoading(true);
      const formData = new FormData(form);
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      if (!title.trim().length || !description.trim().length) {
        throw new Error("Judul dan deskripsi tidak boleh kosong");
      }
      const newTask = {
        title,
        description,
      };

      const { res: response } = await apiRequest.post(
        "/api/tasks?projectId=" + projectId,
        newTask
      );
      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.message || "Something went wrong");
      }
      setTasks([...tasks, result.data]);
      toast.success("Task added successfully");
      setisFormDialogAddTaskLoading(false);
      setIsFormDialogAddTaskOpen(false);
    } catch (error) {
      setisFormDialogAddTaskLoading(false);
      toast.error((error as Error).message);
    }
  };

  const handleEditTitleAndDescTask: FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();
    try {
      setIsUpating({ ...isUpating, update: true });
      const { res } = await apiRequest.update(`/api/tasks/${selectedTask.id}`, {
        title: selectedTask.title,
        description: selectedTask.description,
      });
      const result = await res.json();
      if (!res.ok || result.error) {
        throw new Error(result.message || "Something went wrong");
      }
      setTasks(
        tasks.map((task) => (task.id === selectedTask.id ? result.data : task))
      );
      toast.success("Task updated successfully");
      setIsEditTaskDialogOpen(false);
      setSelectedTask(initializeTask);
      setEditTaskStep(1);
      setIsUpating({ ...isUpating, update: false });
    } catch (error) {
      setIsUpating({ ...isUpating, update: false });
      console.error(error);
      toast.error((error as Error).message);
    }
  };

  const handleDeleteTask = async () => {
    try {
      setIsUpating({ ...isUpating, delete: true });
      const { res } = await apiRequest.delete(`/api/tasks/${selectedTask.id}`);
      const result = await res.json();
      if (!res.ok || result.error) {
        throw new Error(result.message || "Something went wrong");
      }
      setTasks(tasks.filter((task) => task.id !== selectedTask.id));
      toast.success("Task deleted successfully");
      setIsDeleteTaskDialogOpen(false);
      setSelectedTask(initializeTask);
      setEditTaskStep(1);
      setIsUpating({ ...isUpating, delete: false });
    } catch (error) {
      setIsUpating({ ...isUpating, delete: false });
      console.error(error);
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="">
        <BackButton />
      </div>
      <div className="flex gap-6 items-center">
        <Dialog
          open={isFormDialogAddTaskOpen}
          onOpenChange={setIsFormDialogAddTaskOpen}
        >
          <DialogTrigger asChild>
            <Button
              className="w-fit"
              onClick={() => setIsFormDialogAddTaskOpen(true)}
            >
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Task</DialogTitle>
            </DialogHeader>
            <DialogDescription asChild>
              <form onSubmit={addTask} className="flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                  <label htmlFor="title" className="space-y-3">
                    Title:
                  </label>
                  <Input type="text" name="title" id="title" />
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="description" className="space-y-3">
                    Description:
                  </label>
                  <Textarea name="description" id="description" />
                </div>
                <Button disabled={isFormDialogAddTaskLoading}>Submit</Button>
              </form>
            </DialogDescription>
          </DialogContent>
        </Dialog>
        <Dialog
          open={isEditTaskDialogOpen}
          onOpenChange={setIsEditTaskDialogOpen}
        >
          <DialogTrigger asChild>
            <Button onClick={openEditDialog}>Edit</Button>
          </DialogTrigger>
          <DialogContent className="p-6">
            <DialogTitle>Edit Task</DialogTitle>
            {editTaskStep === 1 ? (
              <Select
                value={selectedTask?.id || ""}
                onValueChange={(value) =>
                  setSelectedTask(
                    tasks.find((task) => task.id === value) ?? selectedTask
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a task" />
                </SelectTrigger>
                <SelectContent>
                  <SelectScrollUpButton />
                  <SelectViewport>
                    <SelectGroup>
                      {tasks.map((task) => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.title}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectViewport>
                  <SelectScrollDownButton />
                </SelectContent>
                <Button
                  onClick={() => {
                    if (selectedTask.id) {
                      setEditTaskStep(2);
                    } else {
                      toast.error("Mohon pilih task yang akan diedit");
                    }
                  }}
                >
                  Next
                </Button>
              </Select>
            ) : (
              <form onSubmit={handleEditTitleAndDescTask} className="space-y-4">
                <div className="flex flex-col gap-3">
                  <label htmlFor="title" className="space-y-3">
                    New Task Title:
                  </label>
                  <Input
                    type="text"
                    name="title"
                    id="title"
                    defaultValue={selectedTask?.title || ""}
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="description" className="space-y-3">
                    New Task Description:
                  </label>
                  <Textarea
                    name="description"
                    id="description"
                    defaultValue={selectedTask?.description || ""}
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <Button
                  disabled={isUpating.update}
                  className="w-full text-center"
                >
                  Submit
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
        <Dialog
          open={isDeleteTaskDialogOpen}
          onOpenChange={setIsDeleteTaskDialogOpen}
        >
          <DialogTrigger asChild>
            <Button onClick={openDeleteDialog} variant="destructive">
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent className="p-6">
            <DialogTitle>Delete Task</DialogTitle>
            {editTaskStep === 1 ? (
              <Select
                value={selectedTask?.id || ""}
                onValueChange={(value) =>
                  setSelectedTask(
                    tasks.find((task) => task.id === value) ?? selectedTask
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a task" />
                </SelectTrigger>
                <SelectContent>
                  <SelectScrollUpButton />
                  <SelectViewport>
                    <SelectGroup>
                      {tasks.map((task) => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.title}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectViewport>
                  <SelectScrollDownButton />
                </SelectContent>
                <Button
                  onClick={() => {
                    if (selectedTask.id) {
                      setEditTaskStep(2);
                    } else {
                      toast.error("Mohon pilih task ");
                    }
                  }}
                >
                  Next
                </Button>
              </Select>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="mt-4">
                  Are you sure you want to delete this task?
                </p>
                <Button
                  disabled={isUpating.delete}
                  variant={"destructive"}
                  onClick={handleDeleteTask}
                >
                  Delete
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      {tasks.length ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-3 gap-4">
            {statuses.map((status) => {
              const columnTasks = tasks.filter(
                (task) => task.status === status
              );
              return (
                <DroppableColumn key={status} id={status}>
                  <div className="flex-1 bg-zinc-100 dark:bg-zinc-900 p-4 rounded-md min-h-[200px]">
                    <h2 className="text-xl font-semibold mb-4">{status}</h2>

                    <SortableContext
                      items={columnTasks.map((task) => task.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {columnTasks.map((task) => (
                        <TaskCard key={task.id} task={task} status={status} />
                      ))}
                    </SortableContext>
                  </div>
                </DroppableColumn>
              );
            })}
          </div>
        </DndContext>
      ) : (
        <div className="flex flex-col gap-2 justify-center items-center text-sm text-zinc-500">
          <span>Project ini belum memiliki tugas</span>
          <span>Silahkan Buat tugas terlebih dahulu</span>
        </div>
      )}
    </div>
  );
};
export default KanbanDND;
