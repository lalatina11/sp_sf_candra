import { Task } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params
        const { status } = await req.json() as Task
        const updatedTask = await prisma.task.update({ where: { id }, data: { status } })
        return NextResponse.json({ message: "OK", data: updatedTask, error: false }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: (error as Error).message, data: null, error: true }, { status: 400 })
    }
}