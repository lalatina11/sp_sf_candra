export const apiRequest = {
    get: async (url: string) => {
        const res = await fetch(url, { credentials: "include" })
        return { res }
    },
    post: async (url: string, formBody?: unknown) => {
        const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: formBody ? JSON.stringify(formBody) : null })
        return { res }
    },
    update: async (url: string, formBody?: unknown) => {
        const res = await fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include", body: formBody ? JSON.stringify(formBody) : null })
        return { res }
    },
    delete: async (url: string) => {
        const res = await fetch(url, { method: "DELETE", headers: { "Content-Type": "application/json" }, credentials: "include", })
        return { res }
    }
}