import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const matters = await prismadb.matter.findMany({
      where: { status: true },
      include: {
        topics: true, 
      },
    });

    if (matters) {
      return Response.json({
        message: "matters find with success",
        data: matters,
        status: 200,
      });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal sever error", status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { matter } = await request.json();

    const createdMatter = await prismadb.matter.create({
      data: {
        name: matter.name,
        status: matter.status,
        studyDays: matter.studyDays,
      },
    });

    if (createdMatter) {
      return Response.json({
        message: "matter created with success",
        data: createdMatter,
        status: 201,
      });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal sever error", status: 500 });
  }
}
