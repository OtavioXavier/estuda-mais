import prismadb from "@/lib/prismadb";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { topic } = await request.json();

    if (topic) {
      const updatedTopic = await prismadb.topic.update({
        where: { id },
        data: {
          title: topic.title,
          status: topic.status,
        },
      });
      console.log("topic sended: ", topic);
      console.log("topic updated: ", updatedTopic);
      return Response.json({
        message: "topic updated",
        status: 200,
        data: updatedTopic,
      });
    } else {
      return Response.json({ message: "topic data invalid", status: 400 });
    }
  } catch (error: any) {
    console.log(error);
  }
}

export async function DELETE(req: Request,
  { params }: { params: { id: string } }) {
    try {
    const { id } = params;

    console.log(id);
    if (id) {
      const deletedTopic = await prismadb.topic.delete({
        where: { id },
      });

      return Response.json({
        message: "topic deleted",
        status: 200,
        data: deletedTopic,
      });
    } else {
      return Response.json({ message: "topic data invalid", status: 400 });
    }
  } catch (error: any) {
    console.log(error);
  }
}
