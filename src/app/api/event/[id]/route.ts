import prismadb from '@/lib/prismadb';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { event } = await request.json();

    if (event) {
      const updatedEvent = await prismadb.event.update({
        where: { id },
        data: {
          title: event.title,
          description: event.description,
          dateSet: event.dateSet,
          status: event.status,
          studentId: event.studentId,
          finishedAt: event.finishedAt,
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
        },
      });
      console.log("Event sended: ", event);
      console.log("Event updated: ", updatedEvent);
      return Response.json({ message: "Event updated", status: 200 });
    } else {
      return Response.json({ message: "Event data invalid", status: 400 });
    }
  } catch (error: any) {
    console.log(error);
  }
}
