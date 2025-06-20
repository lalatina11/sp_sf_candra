import { User } from "@/generated/prisma";
import { registerUserService } from "@/server/services/user";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const body = await req.json() as User
    try {
        await registerUserService(body);
        return NextResponse.json({ message: "Register Success!", error: false }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Register Failed!", error: (error as Error).message },
            { status: 400 }
        );
    }
}