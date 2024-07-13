 import {v4 as uuidv4} from "uuid";
 import { currentProfile } from "@/lib/currentProfile";
 import { db } from "@/lib/db";
import { error } from "console";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

 export async function POST(req: Request) {
    try{
        const {name, imageUrl} = await req.json();
        const profile = await currentProfile();

        if(!profile){
            return new NextResponse("Unauthorised",{status: 401});
        }

        const server = await db.server.create({
            data:{
                profileId: profile.id,
                name,
                imageUrl,
                inviteCode: uuidv4(),
                channels:{
                    create:[
                        {name:"general",profileId: profile.id}
                    ]
                },
                memebers:{
                    create:[
                        {profileId: profile.id, role: MemberRole.ADMIN}
                    ]
                }
            }
        });
        return NextResponse.json(server);
    }
    catch(eroor){
        console.log("[SERVERS_POST]",error);
        return new NextResponse("Internal Error",{status: 500});
    }
 }