import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col">
       <UserButton afterSignOutUrl="/"></UserButton>
       <ModeToggle></ModeToggle>
    </div>
  );
}
