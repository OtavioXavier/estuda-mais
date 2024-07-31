import prismadb from '@/lib/prismadb';

export async function POST(req: Request) {
  try {
    const {topic} = await req.json();
console.log(topic)
    if (
      !topic.title ||
      !topic.matterId
    ) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 404 }
      );
    }

    const createdTopic = await prismadb.topic.create({
      data: {
        title: topic.title,
        matterId: topic.matterId,
        status: true,
      },
    });

    if (createdTopic) {
      console.log("new Topic: ", createdTopic);
      return Response.json({ message: "topic created", status: 201, data: createdTopic });
    }
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
