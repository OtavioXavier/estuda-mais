import prismadb from "@/lib/prismadb";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { target } = await request.json();

    if (target) {
      const updatedTarget = await prismadb.target.update({
        where: { id },
        data: {
          title: target.title,
          deadline: target.deadline,
          subjects: target.subjects,
          subjectTarget: target.subjectTarget,
          status: target.status,
          finishedAt: target.finishedAt,
          studentId: target.studentId,
          createdAt: target.createdAt,
          updatedAt: target.updatedAt,
        },
      });
      console.log("target sended: ", target);
      console.log("target updated: ", updatedTarget);
      return Response.json({ message: "target updated", status: 200 });
    } else {
      return Response.json({ message: "target data invalid", status: 400 });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function DELETE(  request: Request,{ params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const deletedTarget = await prismadb.target.delete({ where: { id } });

    if (deletedTarget) {
      return Response.json({ message: "target deleted", status: 200 });
    } else {
      return Response.json({ message: "target id invalid", status: 400 });
    }
  } catch (error) {
    console.log(error);
    return Response.json({ message: "server error", status: 500 });
  }
}
