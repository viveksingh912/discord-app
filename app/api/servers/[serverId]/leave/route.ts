import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request,
    {params}:{params:{serverId: string}}
) {
    try{
        const profile = await currentProfile();
        if(!profile){
            return new NextResponse("Unauthorised", {status: 401});
        }

        if(!params.serverId){
            return new NextResponse("Server ID is required", {status: 400});
        }
        const server= await db.server.update({
            where:{
                id: params.serverId,
                profileId:{
                    not: profile.id,
                },
                memebers:{
                    some:{
                        profileId: profile.id,
                    }
                }
            },
            data:{
                memebers:{
                    deleteMany:{
                        profileId: profile.id,
                    }
                }
            }
        })
        return NextResponse.json(server);

    }
    catch(error){
        console.log("SERVER_ID_LEAVE" ,error);
        return new NextResponse("Internal server error", {status: 500});
    }
}