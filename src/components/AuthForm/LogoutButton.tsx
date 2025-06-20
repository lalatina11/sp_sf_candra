"use client";
import { apiRequest } from "@/lib/apiRequest";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const { push } = useRouter();
  const handleLogout = async () => {
    await apiRequest.post("/api/logout");
    toast("logout berhasil");
    return setTimeout(() => {
      push("/login");
    }, 400);
  };
  return (
    <Button
      onClick={handleLogout}
      className="cursor-pointer"
      variant={"destructive"}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
