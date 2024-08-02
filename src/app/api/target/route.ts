import { CreateTargetDto } from "@/dto/create-target.dto";
import prismadb from "@/lib/prismadb";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const targets = await prismadb.target.findMany();

    return Response.json({ data: targets });
  } catch (error) {
    console.log(error);
    return Response.json({ error: error });
  }
}

export async function POST(req: NextRequest) {
  try {
    const target: CreateTargetDto = await req.json();

    const { title, deadline, type, subjects } = target;

    if (
      !title ||
      !deadline ||
      !type ||
      (type && type === "subjects" && !subjects)
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const createdTarget = await prismadb.target.create({
      data: {
        title,
        deadline: new Date(deadline),
        status: true,
        subjects: 0,
        subjectTarget: type === "subjects" ? Number(subjects) : null,
        updatedAt: new Date(),
        finishedAt: new Date(deadline),
      },
    });

    if (createdTarget) {
      return NextResponse.json({
        target,
        message: "Your target has been created",
        status: HttpStatusCode.Created,
      });
    }
  } catch (error) {
    return NextResponse.json(
      { message: error },
      { status: HttpStatusCode.BadRequest }
    );
  }
}
