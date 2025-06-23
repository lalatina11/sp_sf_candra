import { Task } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params
        const task = await prisma.task.findUnique({ where: { id } });
        if (!task) {
            throw new Error("Task not found!");
        }
        const { status, title, description } = await req.json() as Task
        const updatedTask = await prisma.task.update({
            where: { id },
            data: {
                status: status ?? task.status,
                title: title ?? task.title,
                description: description ?? task.description,
            },
        });
        return NextResponse.json({ message: "OK", data: updatedTask, error: false }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: (error as Error).message, data: null, error: true }, { status: 400 })
    }
}


export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params
        if (!id) {
            throw new Error("ID tugas diperlukan!");
        }
        const task = await prisma.task.findUnique({ where: { id } });
        if (!task) {
            throw new Error("Tugas tidak ditemukan!");
        }

        await prisma.task.delete({ where: { id } })
        return NextResponse.json({ message: "OK", error: false }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: (error as Error).message, error: true }, { status: 400 })
    }
}


