"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

export const LeaveServerModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { onOpen, isOpen, onClose, type, data } = useModal();

  const isModelOpen = isOpen && type == "leaveServer";
  const { server } = data;
  const router= useRouter();
  // console.log(data);
  const onClick= async ()=>{
    try{
      setIsLoading(true);
      await axios.patch(`/api/servers/${server?.id}/leave`);
      onClose();
      router.refresh();
      router.push("/");
    }catch(error){
      console.log(error);
    }
  }

  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to leave <span
              className="font-semibold text-indigo-500">{server?.name}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-grey-100 px-6 py-4">
          <div className="flex justify-between w-full">
            <Button
            disabled={isLoading}
            onClick={onClose}>
              Cancel
            </Button>
            <Button
            disabled={isLoading}
            variant="primary"
            onClick={onClick}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
