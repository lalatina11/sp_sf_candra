import emailValidator from "email-validator"
export const authSchema = (email: string, password: string) => {
    if (email.trim().length < 6) {
        throw new Error("Email harus diisi minimal 6 karakter!");
    }
    if (!emailValidator.validate(email)) {
        throw new Error("Email tidak valid!");
    }
    if (password.trim().length < 6) {
        throw new Error("Password harus diisi minimal 6 karakter!");
    }
    const body = { email, password };
    return body
}