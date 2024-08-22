import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface InvideCodePageProps{
    params:{
        inviteCode: string;
    }
}
const InviteCodePage = async({params}:InvideCodePageProps) => {
    const profile = await initialProfile();

    if(!profile){
        return auth().redirectToSignIn();
    }
    if(!params.inviteCode){
        return redirect("/");
    }
    const existingServer= await db.server.findFirst({
        where:{
            inviteCode: params.inviteCode,
            memebers:{
                some:{
                    profileId: profile.id,
                }
            }
        }
    })
    if(existingServer){
        return redirect (`/servers/${existingServer.id}`)
    }

    const server = await db.server.update({
        where:{
            inviteCode: params.inviteCode,
        },
        data:{
            memebers:{
                create:[
                    {
                        profileId: profile.id,
                    } 
                ]
            }
        }
    });

    if(server){
        return redirect (`/servers/${server.id}`)
    }
 
    return null;
}
 
export default InviteCodePage;