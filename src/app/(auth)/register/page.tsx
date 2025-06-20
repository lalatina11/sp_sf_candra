import DarkModeSwitcher from "@/components/DarkModeSwitcher";
import RegisterForm from "@/components/auth/RegisterForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Management | Login",
  description: "Multi-User Project Management App",
};

const Page = () => {
  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card className="max-w-sm md:max-w-md m-auto w-full">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Login Into Your Account</CardTitle>
          <DarkModeSwitcher />
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </main>
  );
};

export default Page;
