import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const POST = async () => {
    (await cookies()).delete('user_token')
    return NextResponse.json({ message: "logout Success" })
}