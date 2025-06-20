import { User } from "@/generated/prisma";
import { checkUserService } from "@/server/services/user";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const { email, password } = await req.json() as User

    try {
        const { token } = await checkUserService(
            email,
            password
        );

        await (await cookies()).set("user_token", token, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        return NextResponse.json({ message: "login Success!", token, error: false }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: (error as Error).message, error: true }, { status: 400 }
        );
    }

}