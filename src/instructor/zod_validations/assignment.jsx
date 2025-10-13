import { z } from "zod"

const nameRegex = /^[a-zA-Z\s_-]{1,50}$/;

export const addAssignmentSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required.")
    .max(50, "Title must be at most 50 characters.")
    .regex(
      nameRegex,
      "Only alphabets, space, underscore, and hyphen are allowed. Digits are not allowed."
    ),

  total_marks: z
    .number({
      required_error: "Total marks are required",
    })
    .int(),


  min_percentage: z
    .number({
      required_error: "Minimum percentage is required",
      invalid_type_error: "Percentage must be a number",
    })
    .min(35, { message: "Percentage cannot be less than 35" })
    .max(100, { message: "Percentage cannot be more than 100" }),


  due_date: z
    .string({
      required_error: "Due date is required",
    })
    .transform((val) => val.replace("T", " "))
    .refine(
      (val) => /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(val),
      "Due date must be in the format YYYY-MM-DD HH:MM"
    ),

  subject_id: z
    .number({
      required_error: "Subject ID is required",
    })
    .int(),
  course_id: z
    .number({
      required_error: "Course ID is required",
    })
    .int(),

  attachments: z
    .any()
    .refine((file) => {
      if (!file) return true;
      return file instanceof File && file.type === "application/pdf";
    }, {
      message: "Only PDF files are allowed in attachments."
    })
    .optional(),


  batch_id: z
    .array(
      z
        .number()
        .int()
        .positive({ message: "Each Batch ID must be a positive integer" })
    )
    .nonempty({ message: "At least one batch ID is required" }),
});




export const searchAssignmentsSchema = z.object({

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




export const inputResultAssignmentsSchema = (total_marks) =>
  z.object({
    students: z.array(
      z.object({
        obtained_marks: z
          .string()
          .nullable()
          .optional()
          .refine(
            (val) => val === undefined || val?.trim() === "" || !isNaN(Number(val)),
            { message: "Marks must be a number" }
          )
          .refine(
            (val) => val === undefined || val?.trim() === "" || Number(val) >= 0,
            { message: "Marks cannot be negative" }
          )
          .refine(
            (val) =>
              val === undefined ||
              val?.trim() === "" ||
              Number(val) <= total_marks,
            {
              message: "Marks cannot be more than " + total_marks,
            }
          ),
        note: z
          .string()
          .max(150, "Note must not exceed 150 characters.")
          .nullable()
          .optional()
          .refine(
            (val) =>
              val === null ||
              val === undefined ||
              val?.trim() === "" ||
              /^[A-Za-z\s]+$/.test(val),
            {
              message: "Note must contain only alphabets and spaces.",
            }
          ),
      })
    ),
  });
