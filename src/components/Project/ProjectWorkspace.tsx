"use client";
import { useProjectStore } from "@/app/utils/stores";
import { Task, User } from "@/generated/prisma";
import { gettingMembershipUserData } from "@/lib";
import { apiRequest } from "@/lib/apiRequest";
import { ProjectWithUserAndMemberships } from "@/types";
import Link from "next/link";
import { FormEventHandler, useCallback, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";
import { Button, buttonVariants } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface Props {
  currentUserID: string;
  user: User;
  allUsers: User[];
}
const ProjectWorkspace = (props: Props) => {
  const {
    selectedProjectId,
    project: AllProjects,
    addNewProject,
    resetSelectedProjectId,
    setSelectedProjectId,
  } = useProjectStore();
  const [updatedMemberships, setUpdatedMemberships] = useState<
    ProjectWithUserAndMemberships["memberships"]
  >([]);
  const [updatedTaskData, setupdatedTaskData] = useState<Task[]>([]);

  useEffect(() => {
    const memberships = gettingMembershipUserData(
      AllProjects.filter((proj) => proj.id === selectedProjectId)
    );
    setUpdatedMemberships(memberships);
    SetIsDeleteMemberDialogOpen(false);
  }, [AllProjects, selectedProjectId]);

  const gettingTaskData = useCallback(async () => {
    try {
      const { res } = await apiRequest.get(
        "/api/tasks?projectId=" + selectedProjectId
      );
      const result = await res.json();
      const allTasks = result.data as Task[];
      setupdatedTaskData(allTasks);
    } catch (error) {
      console.error(error);
      toast((error as Error).message);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    gettingTaskData();
  }, [AllProjects, gettingTaskData, selectedProjectId]);

  const [isDeleteDialogOpen, setisDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setisEditDialogOpen] = useState(false);
  const openDeleteDialog = () => setisDeleteDialogOpen(true);
  const closeDeleteDialog = () => setisDeleteDialogOpen(false);
  const openEditDialog = () => setisEditDialogOpen(true);
  const closeEditDialog = () => setisEditDialogOpen(false);
  const [isDeletingProjectLoading, setIsDeletingProjectLoading] =
    useState(false);
  const [isDeletingMembershipLoading, setIsDeletingMembershipLoading] =
    useState(false);
  const [isEditingProjectLoading, setisEditingProjectLoading] = useState(false);
  const [isAddMemberDialogOpen, setisAddMemberDialogOpen] = useState(false);
  const openAddMemberDialog = () => setisAddMemberDialogOpen(true);
  const [isAddingMemberLoading, setisAddingMemberLoading] = useState(false);
  const [userIdForAddMembership, setUserIdForAddMembership] = useState("");
  const [isDeleteMemberDialogOpen, SetIsDeleteMemberDialogOpen] =
    useState(false);
  const openDeleteMemberDialog = () => SetIsDeleteMemberDialogOpen(true);

  const handleAddMemberShip: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    try {
      setisAddingMemberLoading(true);
      const { res } = await apiRequest.post(
        `/api/memberships?projectId=${selectedProjectId}`,
        { userId: userIdForAddMembership }
      );
      const result = await res.json();
      if (!res.ok || result.error) {
        throw new Error(result.message || "Failed to add membership");
      }
      const newMembership = result.data;
      form.reset();
      setUpdatedMemberships([...updatedMemberships, newMembership]);
      toast("Membership ditambahkan");
      setisAddingMemberLoading(false);
      setisAddMemberDialogOpen(false);
      SetIsDeleteMemberDialogOpen(false);
    } catch (error) {
      SetIsDeleteMemberDialogOpen(false);
      setisAddingMemberLoading(false);
      toast((error as Error).message);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      setIsDeletingProjectLoading(true);
      const { res } = await apiRequest.delete(`/api/projects/${id}`);
      const result = await res.json();
      if (!res.ok || result.error) {
        throw new Error(result.message);
      }
      addNewProject(AllProjects.filter((proj) => proj.id !== id));
      resetSelectedProjectId();
      toast("Project berhasil dihapus");
      setIsDeletingProjectLoading(false);
    } catch (error) {
      console.log(error);
      setIsDeletingProjectLoading(false);
      toast((error as Error).message);
    }
  };

  const handleEditProject: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    try {
      setisEditingProjectLoading(true);
      const formData = new FormData(form);
      const name = formData.get("name") as string;
      if (!name.trim().length) {
        throw new Error("mohon isi nama project anda");
      }
      const { res } = await apiRequest.update(
        `/api/projects/${selectedProjectId}`,
        {
          name,
        }
      );
      const result = await res.json();
      if (!res.ok || result.error) {
        throw new Error(result.message);
      }
      addNewProject(
        AllProjects.map((pj) =>
          pj.id === selectedProjectId ? result.data : pj
        )
      );
      setSelectedProjectId(result.data.id);
      setisEditingProjectLoading(false);
      toast("Project berhasil diedit");
      closeEditDialog();
      form.reset();
    } catch (error) {
      console.log(error);
      setisEditingProjectLoading(false);
      toast((error as Error).message);
    }
  };

  const handleDeleteMembership = async (id: string) => {
    try {
      setIsDeletingMembershipLoading(true);
      await apiRequest.delete(`/api/memberships/${id}`);
      setUpdatedMemberships(updatedMemberships.filter((m) => m.id !== id));
      toast("Membership berhasil dihapus");
      setIsDeletingMembershipLoading(false);
      SetIsDeleteMemberDialogOpen(false);
    } catch (error) {
      SetIsDeleteMemberDialogOpen(false);
      setIsDeletingMembershipLoading(false);
      toast((error as Error).message);
    }
  };

  return (
    <main className="flex-1 flex p-4">
      {AllProjects.length && selectedProjectId ? (
        AllProjects.filter((pr) => pr.id === selectedProjectId).map(
          (project, idx) => {
            return (
              <div className="flex flex-1" key={idx}>
                <div className="flex flex-col gap-8 min-h-screen flex-1">
                  <div className="flex flex-col gap-3 justify-between">
                    <span>Nama Project: {project.name}</span>
                    <span>Owner Project: {project.owner.email}</span>
                  </div>
                  {updatedTaskData.length ? (
                    <div className="grid grid-cols-2 gap-4 pr-4">
                      {updatedTaskData.map((task, idx) => (
                        <Link href={"/projects/" + selectedProjectId} key={idx}>
                          <Card>
                            <CardHeader>
                              <CardTitle>{task.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <CardDescription>
                                {task.description}
                              </CardDescription>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 justify-center items-center">
                      <span className="text-sm font-semibold text-zinc-500">
                        Project ini belum memiliki tugas
                      </span>
                    </div>
                  )}
                  <div className="flex justify-center gap-5 items-center p-4">
                    <Dialog
                      open={isDeleteDialogOpen}
                      onOpenChange={setisDeleteDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button onClick={openDeleteDialog}>
                          Hapus Project ini
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader className="space-y-6">
                          <DialogTitle className="flex flex-col gap-3">
                            <span>
                              Apakah anda yakin ingin menghapus project ini
                            </span>
                            <span className="text-sm text-red-500">
                              Tindakan ini tidak bisa dipulihkan
                            </span>
                          </DialogTitle>

                          <DialogDescription className="flex items-center justify-between">
                            <Button
                              variant={"destructive"}
                              onClick={() => handleDeleteProject(project.id)}
                              disabled={isDeletingProjectLoading}
                            >
                              Hapus
                            </Button>
                            <Button onClick={closeDeleteDialog}>Batal</Button>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>

                    <Dialog
                      open={isEditDialogOpen}
                      onOpenChange={setisEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button onClick={openEditDialog}>
                          Edit project ini
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader className="space-y-6">
                          <DialogTitle className="flex flex-col gap-3">
                            <span>Ubah nama project menjadi</span>
                          </DialogTitle>
                          <DialogDescription asChild>
                            <form
                              onSubmit={handleEditProject}
                              className="flex flex-col gap-3"
                            >
                              <Input
                                type="text"
                                name="name"
                                defaultValue={project.name}
                              />
                              <Button
                                variant={"default"}
                                disabled={isEditingProjectLoading}
                              >
                                Submit
                              </Button>
                            </form>
                          </DialogDescription>
                          <DialogDescription asChild></DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    <Link
                      className={"" + buttonVariants({ variant: "default" })}
                      href={"/projects/" + project.id}
                    >
                      Manage Task
                    </Link>
                  </div>
                </div>
                <div className="w-72 border rounded-lg overflow-x-hidden border-zinc-500 p-4 h-screen overflow-y-scroll flex flex-col gap-3">
                  <span>Member list</span>
                  {updatedMemberships.length ? (
                    updatedMemberships.map((member) => {
                      return (
                        <span
                          className="flex gap-2 items-center justify-between"
                          key={member.id}
                        >
                          <span>{member.user.email}</span>
                          <Dialog
                            open={isDeleteMemberDialogOpen}
                            onOpenChange={SetIsDeleteMemberDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                onClick={openDeleteMemberDialog}
                                className="cursor-pointer"
                                variant={"destructive"}
                                disabled={isDeletingMembershipLoading}
                              >
                                <MdDelete />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader className="space-y-6">
                                <DialogTitle className="flex flex-col gap-3">
                                  <span>
                                    Apakah anda yakin ingin menghapus member
                                    ini?
                                  </span>
                                  <span className="text-sm text-red-500">
                                    Tindakan ini tidak bisa dipulihkan
                                  </span>
                                </DialogTitle>
                                <DialogDescription className="flex items-center justify-between">
                                  <Button
                                    variant={"destructive"}
                                    onClick={() =>
                                      handleDeleteMembership(member.id)
                                    }
                                  >
                                    Hapus
                                  </Button>
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        </span>
                      );
                    })
                  ) : (
                    <span>Belum ada member</span>
                  )}
                  <Dialog
                    open={isAddMemberDialogOpen}
                    onOpenChange={setisAddMemberDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        onClick={openAddMemberDialog}
                        hidden={project.ownerId !== props.currentUserID}
                        className="w-fit m-auto"
                      >
                        Tambah member baru
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader className="space-y-6">
                        <DialogTitle className="flex flex-col gap-3">
                          <span>Tambah member baru</span>
                        </DialogTitle>
                        <DialogDescription asChild>
                          <form
                            onSubmit={handleAddMemberShip}
                            className="flex flex-col gap-3"
                          >
                            <div>
                              <label htmlFor="email">Ketikkan email user</label>
                              <Input
                                type="email"
                                id="email"
                                list="userEmails"
                                onChange={(e) => {
                                  const selectedUser = props.allUsers.find(
                                    (user) => user.email === e.target.value
                                  );
                                  if (selectedUser) {
                                    setUserIdForAddMembership(selectedUser.id);
                                  }
                                }}
                              />
                              <datalist id="userEmails">
                                {props.allUsers
                                  .filter(
                                    (usr) =>
                                      usr.id !== props.currentUserID &&
                                      !updatedMemberships.some(
                                        (m) => m.userId === usr.id
                                      )
                                  )
                                  .map((user) => (
                                    <option key={user.id} value={user.email} />
                                  ))}
                              </datalist>
                            </div>
                            <Input
                              type="text"
                              name="userId"
                              id="userId"
                              hidden
                              defaultValue={userIdForAddMembership}
                            />
                            <Button
                              variant={"default"}
                              disabled={isAddingMemberLoading}
                            >
                              Submit
                            </Button>
                          </form>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
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

export default ProjectWorkspace;
