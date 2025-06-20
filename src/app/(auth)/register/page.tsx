import AuthForm from "@/components/AuthForm";
import BackButton from "@/components/BackButton";
import { ModeToggle } from "@/components/ModeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Management | Login",
  description: "Multi-User Project Management App",
};

const Page = () => {
  return (
    <main className="flex flex-col gap-3 min-h-screen justify-center items-center">
      <div className="w-max mx-auto flex flex-col gap-3">
        <BackButton />
        <Card className="max-w-sm md:max-w-md w-full">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Login Into Your Account</CardTitle>
            <ModeToggle />
          </CardHeader>
          <CardContent>
            <AuthForm type="register" />
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Page;
