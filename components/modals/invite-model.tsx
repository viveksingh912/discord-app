"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Check, Copy, RefreshCw } from "lucide-react";
import { userOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";

export const InviteModal = () => {
  const [copied, setCopied] =useState(false);
  const [isLoading, setIsLoading]= useState(false);
  const {onOpen, isOpen, onClose, type ,data} = useModal();
  const origin= userOrigin();

  const isModelOpen = isOpen && type == "invite";
  const {server} = data;

  const onCopy= ()=>{
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
        setCopied(false);
    }, 1000);
  }

  const onNew = async()=>{
    try{
        setIsLoading(true);
        const response =await axios.patch(`/api/servers/${server?.id}/invite-code`);
        onOpen("invite", {server: response.data});
    }
    catch(error){
        
    }finally{
        setIsLoading(false);
    }
  }

  const inviteUrl= `${origin}/invite/${server?.inviteCode}`;
  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label
            className="uppercase text-xs font-bold
                text-zinc-500 dark:text-secondary/70"
          >
            Server Invite Link
          </Label>
          <div className="flex  items-center mt-2 gap-x-2">
            <Input
             disabled={isLoading}
              className="bg-zinc-300/50 border-0
                    focus-visible:ring-0 text-black
                    focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button  disabled={isLoading} onClick={(onCopy)} size="icon">
             {copied ?<Check className="w-4 h-4"/>:
              <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <Button
            onClick={onNew}
            variant="link"
            size="sm"
            className="text-xs text-zinc-400 mt-4"
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4 mr-2"/>
            Generate a new link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
