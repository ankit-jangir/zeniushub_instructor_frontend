import { z } from "zod"

export const schema = z.object({
  date: z.string().min(1, "Date is required"),
});


 export const homeworkSchema = z.object({
  subject: z.string().min(1, { message: "Subject is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  file: z
    .any()
    .refine((file) => file instanceof FileList && file.length > 0, {
      message: "File is required",
    }),
});

const nameRegex = /^[A-Za-z _-]+$/;

export const searchBatchSchema = z.object({
  title: z
    .string()
    .trim()
    .max(50, "Title must be at most 50 characters.")
    .refine(
      (val) => val === "" || nameRegex.test(val),
      {
        message: "Only alphabets, space, underscore, and hyphen are allowed. Digits are not allowed.",
      }
    )
});



export const searchDetailSchema = z.object({

  title: z
    .string()
    .trim()
    .max(50, 'Title must be at most 50 characters.')
    .transform(val => val === "" ? undefined : val)
    .optional()
    .refine(
      (val) => !val || nameRegex.test(val),
      {
        message: "Only alphabets, space, underscore, and hyphen are allowed. Digits are not allowed.",
      }
    )

});
