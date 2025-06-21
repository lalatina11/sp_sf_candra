import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = await params
        await prisma.membership.delete({ where: { id } })
        return NextResponse.json({ message: "OK", error: false }, { status: 400 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: (error as Error).message, error: true }, { status: 400 })
    }
}
