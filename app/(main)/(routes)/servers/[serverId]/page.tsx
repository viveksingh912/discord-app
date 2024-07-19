import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { auth, redirectToSignIn } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface ServerIdPageProgs {
    params: {
        serverId: string;
    }
}
const ServerPage = async ({ params }: ServerIdPageProgs) => {
    const profile = await currentProfile();

    if(!profile){
        return auth().redirectToSignIn();
    }

    const server=await  db.server.findUnique({
        where:{
            id: params.serverId,
            memebers:{
                some:{
                    profileId: profile.id,
                }
            }
        },
        include:{
            channels:{
                where:{
                    name: "general",
                },
                orderBy: {
                    createdAt: "asc",
                }
            },
        }
    });

    const initialChannel = server?.channels[0];

    if(initialChannel?.name !== "general"){
        return null;
    }

    return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`);
}

export default ServerPage;