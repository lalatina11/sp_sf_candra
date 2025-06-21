"use client";
import { apiRequest } from "@/lib/apiRequest";
import { toast } from "sonner";
import { Button } from "../ui/button";

const LogoutButton = () => {
  const handleLogout = async () => {
    await apiRequest.post("/api/logout");
    toast("logout berhasil");
    return setTimeout(() => {
      location.replace("/login");
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
