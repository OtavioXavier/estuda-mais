import { UpdateTargetDto } from "@/dto/update-target.dto";
import prismadb from "@/lib/prismadb";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const target = await prismadb.target.findUnique({
      where: { id: params.id },
    });
    if (target) {
      return NextResponse.json({ target });
    }
    return NextResponse.json(
      { message: `target ${params.id} not found` },
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
    const target = await prismadb.target.findUnique({
      where: { id: params.id },
    });

    if (target) {
      const body: UpdateTargetDto = await req.json();
      const updatedTarget = await prismadb.target.update({
        where: { id: params.id },
        data: {
          title: body.title || target.title,
          deadline: body.deadline || target.deadline,
          subjects: body.subjects || target.subjects,
          subjectTarget: body.subjectTarget || target.subjectTarget,
          status: body.status ?? target.status,
          finishedAt: body.finishedAt || target.finishedAt,
          updatedAt: new Date(),
        },
      });
      return NextResponse.json({ updatedTarget });
    }
    return NextResponse.json(
      { message: `Target ${params.id} not found` },
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
    const target = await prismadb.target.findUnique({
      where: { id: params.id },
    });

    if (target) {
      const deletedTarget = await prismadb.target.delete({
        where: { id: params.id },
      });
      console.log(deletedTarget);
      return NextResponse.json({
        message: `Target ${params.id} has been deleted`,
      });
    }

    return Response.json({
      message: `Target ${params.id} not found`,
      status: HttpStatusCode.NotFound,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: error, status: HttpStatusCode.BadRequest });
  }
}
