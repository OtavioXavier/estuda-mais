import { UpdateMatterDto } from "@/dto/update-matter.dto";
import prismadb from "@/lib/prismadb";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const matter = await prismadb.matter.findUnique({
      where: { id: params.id },
    });
    if (matter) {
      return NextResponse.json({ matter });
    }
    return NextResponse.json(
      { message: `matter ${params.id} not found` },
      { status: HttpStatusCode.NotFound }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error },
      { status: HttpStatusCode.BadRequest }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const matter = await prismadb.matter.findUnique({
      where: { id: params.id },
    });

    if (matter) {
      const body: UpdateMatterDto = await req.json();
      const updatedMatter = await prismadb.matter.update({
        where: { id: params.id },
        data: {
          updatedAt: body.updated_at,
          name: body.name || matter.name,
          status: body.status || matter.status,
          studyDays: body.studyDays || matter.studyDays,
        },
      });
      return NextResponse.json({ matter });
    }
    return NextResponse.json(
      { message: `Matter ${params.id} not found` },
      { status: HttpStatusCode.NotFound }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error },
      { status: HttpStatusCode.BadRequest }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const matter = await prismadb.matter.findUnique({
      where: { id: params.id },
    });

    if (matter) {
      const deletedMatter = await prismadb.matter.delete({
        where: { id: matter.id },
      });

      return NextResponse.json({
        message: `Matter ${params.id} has been deleted`,
      });
    }

    return Response.json({
      message: `Matter ${params.id} not found`,
      status: HttpStatusCode.NotFound,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: error, status: HttpStatusCode.BadRequest });
  }
}
