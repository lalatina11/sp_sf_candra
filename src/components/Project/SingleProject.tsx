"use client";
import { useProjectStore } from "@/app/utils/stores";

const SingleProject = () => {
  const { selectedProjectId, project: AllProjects } = useProjectStore();
  return (
    <main className="flex-1 flex">
      {AllProjects.length && selectedProjectId ? (
        AllProjects.filter((pr) => pr.id === selectedProjectId).map(
          (project) => <div key={project.id}>Nama Project: {project.name}</div>
        )
      ) : (
        <span className="flex-1 flex justify-center items-center">
          Belum ada Project yang dipilih
        </span>
      )}
    </main>
  );
};

export default SingleProject;
