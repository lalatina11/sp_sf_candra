import { ProjectWithUserAndMemberships } from "@/types";

export const gettingMembershipUserData = (projectData: ProjectWithUserAndMemberships[]) => {
    const memberships = projectData.flatMap(proj => proj.memberships)
    return memberships
}