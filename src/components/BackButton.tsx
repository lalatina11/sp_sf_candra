"use client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const { back } = useRouter();
  return (
    <Button
      onClick={() => back()}
      aria-label="Go back"
      className="flex items-center gap-1 w-fit"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5L8.25 12l7.5-7.5"
        />
      </svg>
      Back
    </Button>
  );
};

export default BackButton;
