import { currentProfilePages } from "@/lib/currentProfile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { error } from "console";
import { NextApiRequest } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
) {
    if(req.method !=="POST"){
        return res.status(405).json({error: "method not allowed"});
    }
    try{
        const profile = await currentProfilePages(req);
        const { content, fileUrl}=req.body;
        const {serverId, channelId} =req.query;
        if(!profile){
            return res.status(401).json({error: "Unauthorised"});
        }
        if(!serverId){
            return res.status(401).json({error: "Server id missing"});
        }
        if(!channelId){
            return res.status(401).json({error: "Channel id missing"});
        }
        if(!content){
            return res.status(401).json({error: "Content id missing"});
        }

        const server = await db.server.findFirst({
            where:{
                id: serverId as string,
                memebers:{
                    some:{
                        profileId: profile.id,
                    }
                }
            },
            include:{
                memebers: true,
            }
        })
        if(!server){
            return res.status(404).json({message: "Server not found"});
        }
        const channel= await db.channel.findFirst({
            where:{
                id: channelId as string,
                serverId: serverId as string,
            }
        })
        if(!channel){
            return res.status(404).json({message: "Channel not found"});
        }

        const member= await server.memebers.find((member)=>member.profileId===profile.id);

        if(!member){
            return res.status(404).json({message: "Member not found"});
        }

        const message = await db.message.create({
            data:{
                content,
                fileUrl,
                channelId: channelId as string,
                memberId: member.id,
            },
            include:{
                member:{
                    include:{
                        profile: true,
                    }
                }
            }
        });

        const channelKey = `chat:${channelId}:messages`;
        res?.socket?.server?.io?.emit(channelKey,message);
        return res.status(200).json(200);
}catch(error){
    console.log("MESSAGES_POSt", error);
    return res.status(500).json({message: "Internal Error"});
}
}