import { z } from "zod";

export const matterSchema = z.object({
  name: z
    .string({
      required_error: "name is required",
      invalid_type_error: "name must be a string",
    })
    .min(1, "Name is required"),
  status: z.boolean({
    required_error: "status is required",
    invalid_type_error: "status must be a boolean",
  }),
  studyDays: z
    .number({
      required_error: "studyDays is required",
      invalid_type_error: "studyDays must be a number",
    })
    .array(),
});
