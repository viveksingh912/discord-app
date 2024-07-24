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
import {useRouter } from "next/navigation";
import qs from "query-string";


export const DeleteMessageModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { onOpen, isOpen, onClose, type, data } = useModal();

  const isModelOpen = isOpen && type === "deleteMessage";
  const { apiUrl, query } = data;
  const onClick= async ()=>{
    try{
      setIsLoading(true);
      const url= qs.stringifyUrl({
        url: apiUrl || "",
        query,
      })

      await axios.delete(url);
      onClose();
    }catch(error){
      console.log(error);
    }
    finally{
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to dot this?
            <br/>
            This message will be permanently deleted
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
