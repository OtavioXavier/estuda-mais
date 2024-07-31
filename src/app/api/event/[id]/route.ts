import prismadb from '@/lib/prismadb';

type Params = {
  id: string
}

export async function PUT(
  request: Request, context: { params: Params }
) {
  try {
    const  id  = context.params.id;
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

      return Response.json({ message: "Event updated", status: 200, data: updatedEvent });
    } else {
      return Response.json({ message: "Event data invalid", status: 400 });
    }
  } catch (error) {
    console.log(error);
  }
}
