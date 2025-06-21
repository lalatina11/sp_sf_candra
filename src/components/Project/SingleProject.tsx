"use client";
import { useProjectStore } from "@/app/utils/stores";
import { User } from "@/generated/prisma";
import { gettingMembershipUserData } from "@/lib";
import { ProjectWithUserAndMemberships } from "@/types";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { Button } from "../ui/button";

interface Props {
  currentUserID: string;
  user: User;
}
const SingleProject = (props: Props) => {
  const {
    selectedProjectId,
    project: AllProjects,
    addNewProject,
    resetSelectedProjectId,
  } = useProjectStore();
  const [updatedMemberships, setUpdatedMemberships] = useState<
    ProjectWithUserAndMemberships["memberships"]
  >([]);

  useEffect(() => {
    const memberships = gettingMembershipUserData(
      AllProjects.filter((proj) => proj.id === selectedProjectId)
    );
    setUpdatedMemberships(memberships);
  }, [AllProjects, selectedProjectId]);

  const handleAddMemberShip = () => {
    const newMembership = {
      createdAt: new Date(Date.now()),
      id: (updatedMemberships.length + 1).toString(),
      projectId: selectedProjectId || "",
      updatedAt: new Date(Date.now()),
      userId: props.currentUserID,
      user: props.user,
    };
    setUpdatedMemberships([...updatedMemberships, newMembership]);
  };

  const handleDeleteProject = async (id: string) => {
    addNewProject(AllProjects.filter((proj) => proj.id !== id));
    resetSelectedProjectId();
  };

  return (
    <main className="flex-1 flex p-4">
      {AllProjects.length && selectedProjectId ? (
        AllProjects.filter((pr) => pr.id === selectedProjectId).map(
          (project) => {
            return (
              <div className="flex flex-1" key={project.id}>
                <div className="flex flex-col justify-between min-h-screen flex-1 gap-3">
                  <div className="flex flex-col gap-3 justify-between">
                    <span>Nama Project: {project.name}</span>
                    <span>Owner Project: {project.owner.email}</span>
                  </div>
                  <div className="flex justify-center gap-5 items-center p-4">
                    <Button onClick={() => handleDeleteProject(project.id)}>
                      Hapus Project ini
                    </Button>
                    <Button onClick={() => handleDeleteProject(project.id)}>
                      Edit project ini
                    </Button>
                  </div>
                </div>
                <div className="w-72 border rounded-lg overflow-x-hidden border-zinc-500 p-4 h-screen overflow-y-scroll flex flex-col gap-3">
                  <span>Member list</span>
                  {updatedMemberships.length ? (
                    updatedMemberships.map((member) => {
                      return (
                        <span className="flex gap-2 items-center justify-between" key={member.id}>
                          <span>{member.user.email}</span>
                          <Button
                            className=""
                            variant={"destructive"}
                            onClick={() =>
                              setUpdatedMemberships(
                                updatedMemberships.filter(
                                  (m) => m.id !== member.id
                                )
                              )
                            }
                          >
                            <MdDelete />
                          </Button>
                        </span>
                      );
                    })
                  ) : (
                    <span>Belum ada member</span>
                  )}
                  <Button
                    onClick={handleAddMemberShip}
                    hidden={project.ownerId !== props.currentUserID}
                    className="w-fit m-auto"
                  >
                    Tambah member baru
                  </Button>
                </div>
              </div>
            );
          }
        )
      ) : AllProjects.length && !selectedProjectId ? (
        <span className="flex-1 flex justify-center items-center">
          Belum ada Project yang dipilih
        </span>
      ) : (
        <span>Belum ada Project yang anda buat</span>
      )}
    </main>
  );
};

export default SingleProject;
