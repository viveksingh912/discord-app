import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { error } from "console";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    {params}:{params:{memberId: string}}
){
    try{
        const profile = await currentProfile();

        const {searchParams} = new URL(req.url);

        const serverId = searchParams.get("serverId");

        if (!profile) {
            return new NextResponse("Unauthorised", { status: 401 });
          }
      
        if (!serverId) {
        return new NextResponse("Serve ID missing", { status: 400 });
        }
    
        if (!params.memberId) {
        return new NextResponse("Member id Missing", { status: 400 });
        }

        const server = await db.server.update({
            where:{
                id: serverId,
                profileId: profile.id,
            },
            data:{
                memebers:{
                    deleteMany:{
                        id: params.memberId,
                        profileId:{
                            not: profile.id,
                        }
                    }
                }
            },
            include:{
                memebers:{
                    include:{
                        profile: true,
                    },
                    orderBy:{
                        role: "asc"
                    }
                }
            }
        });
        return NextResponse.json(server);
    }
    catch{
        console.log("MEMBER_ID_DELETE_ERROR",error);
        return new NextResponse("Internal error",{status: 500});
    }
}

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Serve ID missing", { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse("Member id Missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        memebers: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
            },
            data:{
                role
            }
          },
        },
      },
      include:{
        memebers:{
            include:{
                profile: true,
            },
            orderBy:{
                role: "asc",
            }
        }
      }
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEBMBERS_ID_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
