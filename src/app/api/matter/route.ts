import { CreateMatterDto } from "@/dto/create-matter.dto";
import prismadb from "@/lib/prismadb";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const matters = await prismadb.matter.findMany({
      include: {
        topics: true,
      },
    });

    return NextResponse.json({ data: matters });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
}

export async function POST(req: NextRequest) {
  try {
    const matter: CreateMatterDto = await req.json();

    if (matter.name && matter.status && matter.studyDays) {
      const createdMatter = await prismadb.matter.create({
        data: {
          ...matter,
        },
      });
      return NextResponse.json({
        matter,
        message: "Your matter has been created",
        status: HttpStatusCode.Created,
      });
    }

    return NextResponse.json(
      { message: "matter fields is missing" },
      { status: HttpStatusCode.BadRequest }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error },
      { status: HttpStatusCode.BadRequest }
    );
  }
}
