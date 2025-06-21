"use server"

import { cookies } from "next/headers"
import { getUserByToken } from "./services/user"
import { redirect } from "next/navigation"

export const loggedInUser = async () => {
    const cookie = cookies()
    const userToken = (await cookie).get("user_token")?.value
    const user = await getUserByToken(userToken)
    if (!user) return redirect("/login")
    return { user, userId: user.id }
}