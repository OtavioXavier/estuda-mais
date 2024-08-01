export type UpdateMatterDto = {
  name: string | null;
  studyDays: number[] | null;
  status: boolean | null;
  updated_at: Date;
};