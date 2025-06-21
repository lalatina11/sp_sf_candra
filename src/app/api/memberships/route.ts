import { Membership } from "@/generated/prisma"
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
    try {
        const url = new URL(req.nextUrl)
        const projectId = url.searchParams.get('projectId') as string
        const { userId } = await req.json() as Membership
        const newMembership = await prisma.membership.create({ data: { projectId, userId }, include: { user: { select: { email: true } } } })
        return NextResponse.json({ message: "OK", data: newMembership, error: false })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: (error as Error).message, data: null, error: true })
    }
}
