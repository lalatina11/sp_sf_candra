import { Project } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params
        if (!id) {
            throw new Error("Project id are needed!")
        }
        await prisma.project.delete({ where: { id } })
        return NextResponse.json({ message: "OK", error: false }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: (error as Error).message, error: true }, { status: 400 })
    }
}

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params
        if (!id) {
            throw new Error("Project id are needed!")
        }
        const { name } = await req.json() as Project
        if (!name.trim().length) {
            throw new Error("nama project tidak boleh kosong")
        }
        const updatedProject = await prisma.project.update({ where: { id }, data: { name }, include: { owner: { select: { email: true } }, memberships: { include: { user: { select: { email: true } } } } } })
        return NextResponse.json({ message: "OK", data: updatedProject, error: false }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: (error as Error).message, data: null, error: true }, { status: 400 })
    }
}
