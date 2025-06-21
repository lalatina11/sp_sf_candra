"use client";
import { Project as ProjectType } from "@/generated/prisma";
import { Button } from "./ui/button";
import { useProjectStore } from "@/app/utils/stores";

interface Props {
  projects: ProjectType[];
}

const Project = (props: Props) => {
  const { projects } = props;
  const { selectedProjectId, setSelectedProjectId } = useProjectStore();
  return (
    <aside className="w-64 border-r border-zinc-400/50 p-4 space-y-4">
      <h2 className="text-lg font-semibold mb-2">Projects</h2>
      <Button className="text-sm font-semibold" size={"sm"}>
        Buat Project
      </Button>
      <ul>
        <li className="mb-1 flex items-center justify-between">
          <span hidden={!projects.length} className="text-sm">
            Anda memiliki {projects.length} project
          </span>
        </li>
        {projects.length ? (
          projects.map((project) => (
            <li key={project.id} className="mb-1">
              <Button
                onClick={() => setSelectedProjectId(project.id)}
                variant={selectedProjectId === project.id ? "default" : "ghost"}
                disabled={selectedProjectId === project.id}
                className="hover:underline "
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
