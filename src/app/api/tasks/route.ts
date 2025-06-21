import { Task } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const url = new URL(req.nextUrl)
        const projectId = url.searchParams.get('projectId') as string
        if (!projectId) {
            throw new Error("Project ID are required")
        }
        const { title, description } = await req.json() as Task
        const newPost = await prisma.task.create({ data: { projectId, title, description } })
        return NextResponse.json({ message: "created", data: newPost, error: false })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: (error as Error).message, data: null, error: true })
    }
}

export const GET = async (req: NextRequest) => {
    try {
        const url = new URL(req.nextUrl)
        const projectId = url.searchParams.get('projectId') as string
        const tasks = await prisma.task.findMany({ where: { projectId } })
        return NextResponse.json({ message: "OK", data: tasks, error: false })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: (error as Error).message, data: null, error: true })
    }
}