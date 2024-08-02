export type CreateTargetDto = {
  title: string;
  deadline: Date;
  type: "subjects" | "to do";
  subjects?: number;
}