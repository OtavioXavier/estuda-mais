import prismadb from '@/lib/prismadb';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { matter } = await request.json();

    if (matter) {
      const updatedMatter = await prismadb.matter.update({
        where: { id },
        data: {
          name: matter.name,
          studyDays: matter.studyDays,
          topics: matter.topics,
          status: matter.status,
          studentId: matter.studentId,
          createdAt: matter.createdAt,
          updatedAt: matter.updatedAt,
        },
      });
      console.log("Matter sended: ", matter);
      console.log("Matter updated: ", updatedMatter);
      return Response.json({ message: "Matter updated", status: 200 });
    } else {
      return Response.json({ message: "Matter data invalid", status: 400 });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params; 
    const deletedMatter = await prismadb.matter.delete({where: {id}});

    if(!deletedMatter) {
      return Response.json({message: "this matter does not exists", status: 400});
    }
    
    return Response.json({message: "deleted with success", status: 204})
  } catch (error) {
    console.error(error);
    return Response.json({message: error, status: 500})
  }
}