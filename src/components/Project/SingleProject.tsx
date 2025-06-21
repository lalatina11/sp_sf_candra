"use client";
import { useProjectStore } from "@/app/utils/stores";

const SingleProject = () => {
  const { selectedProjectId, project: AllProjects } = useProjectStore();
  return (
    <main className="flex-1 flex p-4">
      {AllProjects.length && selectedProjectId ? (
        AllProjects.filter((pr) => pr.id === selectedProjectId).map(
          (project) => <div className="" key={project.id}>
            <div className="flex flex-col">

            <span>Nama Project: {project.name}</span>
            <span>Owner Project: {project.owner.email}</span>
            </div>
          </div>
        )
      ) : AllProjects.length && !selectedProjectId? (
        <span className="flex-1 flex justify-center items-center">
          Belum ada Project yang dipilih
        </span>
      ):<span>Belum ada Project yang anda buat</span>}
    </main>
  );
};

export default SingleProject;
