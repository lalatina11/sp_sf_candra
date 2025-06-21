import { Project } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { getUserByToken } from "@/server/services/user";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const token = (await cookies()).get('user_token')?.value as string
        const { user } = await getUserByToken(token)
        if (!user) {
            throw new Error("anda harus login dulu")
        }
        const { name } = await req.json() as Project
        if (!name.trim().length) {
            throw new Error("Mohon beri nama Project anda");
        }
        const createProject = await prisma.project.create({ data: { ownerId: user?.id, name }, include: { owner: { select: { email: true } } } })
        return NextResponse.json({ message: "OK", data: createProject, error: false }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: (error as Error).message, data: null, error: false }, { status: 400 })
    }
}