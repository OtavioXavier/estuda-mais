import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const targets = await prismadb.target.findMany({ where: { status: true } });

    if (targets) {
      return Response.json({ 
        message: "targets find with success",
        data: targets, 
        status: 200 });
    }
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Internal sever error", status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, deadline, type, subjects } = body.data;

    console.log(body);

    if (
      !title ||
      !deadline ||
      !type ||
      (type && type === "subjects" && !subjects)
    ) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 }
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
      console.log("new Target: ", body);
      return Response.json({ message: "target created", status: 201 });
    }
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
