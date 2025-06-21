import { Membership, Project, Task, } from "@/generated/prisma";

export type ProjectWithUserAndMemberships = Project & {
  owner: { email: string };
  memberships: (Membership & { user: { email: string } })[];
  tasks: {
    project: {
      _count: {
        memberships: number;
        tasks: number;
      };
      name: string;
      owner: { email: string };
      memberships: (Membership & { user: { email: string } })[];
    };
  }[];
};
export type ProjectWithUserAndMembershipsCount = Project & {
  owner: { email: string };
  memberships: (Membership & { user: { _count: number } })[];
};

export type TaskWithProjectInfo = Task & {
  project: {
    _count: {
      memberships: number;
      tasks: number;
    };
    name: string;
    owner: {
      email: string;
    };
    memberships: (Membership & {
      project: {
        _count: {
          memberships: number;
          tasks: number;
        };
      };
    })[];
  };
};
