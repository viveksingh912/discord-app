import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { error } from "console";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    const {name, imageUrl} = await req.json();
    if(!profile){
        return new NextResponse("Unauthorised", {status: 401});
    }

    const server=await db.server.update({
        where:{
            id: params.serverId,
            profileId: profile.id,
        },
        data:{
            name,
            imageUrl,
        }
    });

    return  NextResponse.json(server);

  } catch(error)
  {
    console.log("SERVER_ID_PATCH", error);
    return new NextResponse("INternal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    if(!profile){
        return new NextResponse("Unauthorised", {status: 401});
    }

    const server=await db.server.delete({
        where:{
            id: params.serverId,
            profileId: profile.id,
        },
    });
    return  NextResponse.json(server);

  } catch(error)
  {
    console.log("SERVER_ID_DELETED", error);
    return new NextResponse("INternal error", { status: 500 });
  }
}
