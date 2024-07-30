import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const events = await prismadb.event.findMany({ where: { status: true } });

    if (events) {
      return Response.json({
        data: events,
        message: "Find with success all events",
        status: 200,
      });
    }
    return Response.json({ message: "There are not events", status: 204 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal server error", status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { event } = await request.json();

    if (!event) {
      return Response.json({ message: "impossible create event", status: 400 });
    }

    const createdEvent = await prismadb.event.create({
      data: {
        title: event.title,
        description: event.description,
        dateSet: event.dateSet,
        status: event.status,
      },
    });

    if(createdEvent) {
      return Response.json({
      message: "event created with success",
      data: createdEvent,
      status: 201,
      })
    }
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal sever error", status: 500 });
  }
}
