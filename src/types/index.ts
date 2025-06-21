import { Project } from "@/generated/prisma";

export type ProjectWithUser = Project & { owner: { email: string } };
