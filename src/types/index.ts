import { Membership, Project, } from "@/generated/prisma";

export type ProjectWithUserAndMemberships = Project & {
    owner: { email: string };
    memberships: (Membership & { user: { email: string } })[];
};
