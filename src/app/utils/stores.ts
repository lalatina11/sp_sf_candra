import { Project } from "@/generated/prisma"
import { ProjectWithUserAndMemberships } from "@/types"
import { create } from "zustand"

type UseProjectStoreType = {
    project: ProjectWithUserAndMemberships[]
    addNewProject: (newProject: UseProjectStoreType['project']) => void
    selectedProjectId: Project['id'] | null
    setSelectedProjectId: (projectID: UseProjectStoreType['selectedProjectId']) => void
    resetSelectedProjectId: () => void
}

export const useProjectStore = create<UseProjectStoreType>((set) => ({
    selectedProjectId: null,
    setSelectedProjectId: (projectId) => set({ selectedProjectId: projectId }),
    resetSelectedProjectId: () => set({ selectedProjectId: null }),
    project: [],
    addNewProject: (newProject) => set({ project: newProject })
}))