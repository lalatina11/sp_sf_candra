import { Project } from "@/generated/prisma"
import { create } from "zustand"

type UseProjectStoreType = {
    project: Project[]
    addNewProject: (newProject: UseProjectStoreType['project']) => void
    selectedProjectId: Project['id'] | null
    setSelectedProjectId: (projectID: UseProjectStoreType['selectedProjectId']) => void
}

export const useProjectStore = create<UseProjectStoreType>((set) => ({
    selectedProjectId: null,
    setSelectedProjectId: (projectId) => set({ selectedProjectId: projectId }),
    project: [],
    addNewProject: (newProject) => set({ project: newProject })
}))