import { ProjectWithUserAndMemberships } from "@/types";

export const gettingMembershipUserData = (projectData: ProjectWithUserAndMemberships[]) => {
    const memberships = projectData.flatMap(proj => proj.memberships)
    return memberships
}

export const gettingTaskData = (projectData: ProjectWithUserAndMemberships[]) => {
    const tasks = projectData.flatMap(proj => proj.tasks)
    return tasks
}