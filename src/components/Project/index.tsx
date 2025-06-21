"use client";
import { useProjectStore } from "@/app/utils/stores";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/apiRequest";
import { ProjectWithUserAndMemberships } from "@/types";
import { FormEventHandler, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface Props {
  projects: ProjectWithUserAndMemberships[];
}

const Project = (props: Props) => {
  const { projects } = props;
  const {
    selectedProjectId,
    setSelectedProjectId,
    project: allProjects,
    addNewProject,
  } = useProjectStore();
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const [isAddingProjectLoading, setIsAddingProjectLoading] = useState(false);
  const handleAddProject: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      setIsAddingProjectLoading(true);
      const form = e.currentTarget;
      const formData = new FormData(form);
      const name = formData.get("name");
      if (!name?.toString().trim().length) {
        throw new Error("Mohon Beri nama project anda");
      }
      const body = { name };
      const { res } = await apiRequest.post("/api/projects", body);
      const result = await res.json();
      if (!res.ok || result.error) {
        throw new Error(result.message || "Something went wrong");
      }
      addNewProject([result.data, ...allProjects]);
      setSelectedProjectId(result.data.id);
      form.reset();
      close();
      toast("Berhasil Menambahkan Project");
      setIsAddingProjectLoading(false);
    } catch (error) {
      toast((error as Error).message);
      setIsAddingProjectLoading(false);
    }
  };
  useEffect(() => {
    addNewProject(projects);
  }, [addNewProject, projects, props.projects]);
  return (
    <aside className="w-64 border-r border-zinc-400/50 p-4 space-y-4">
      <h2 className="text-lg font-semibold mb-2">Projects</h2>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button onClick={open}>Add Project</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="space-y-6">
            <DialogTitle>Tambahkan Project Baru</DialogTitle>
            <DialogDescription asChild>
              <form onSubmit={handleAddProject} className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name">Nama Project Anda</label>
                  <Input type="text" name="name" id="name" />
                </div>
                <div className="text-end">
                  <Button disabled={isAddingProjectLoading}>Submit</Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <ul>
        <li className="mb-1 flex items-center justify-between">
          <span hidden={!allProjects.length} className="text-sm">
            Anda memiliki {projects.length} project
          </span>
        </li>
        {allProjects.length ? (
          allProjects.map((project,idx) => (
            <li key={idx} className="mb-1">
              <Button
                onClick={() => setSelectedProjectId(project.id)}
                variant={selectedProjectId === project.id ? "default" : "ghost"}
                className="hover:underline max-w-full overflow-hidden whitespace-nowrap flex justify-start items-start w-full"
              >
                {project.name}
              </Button>
            </li>
          ))
        ) : (
          <span className="text-sm text-zinc-500">
            Anda belum memiliki project
          </span>
        )}
      </ul>
    </aside>
  );
};
export default Project;
