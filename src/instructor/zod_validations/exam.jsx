import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const timeField = (label) =>
  z.string().regex(/^\d{2}:\d{2}$/, `${label} time must be in HH:MM format`);

export const addexamSchema = z
  .object({
    exam_name: z.string().min(3, "Name must be at least 3 characters").max(50),

    course_id: z.coerce.number().min(1, "Course is required"),

    category_id: z.coerce.number().min(1, "Category is required"),

    subject_id: z.coerce.number().min(1, "Subject is required"),

    batches: z.array(z.number()).min(1, "At least one batch must be selected"),

    total_marks: z.coerce.number().min(1, "Total marks must be greater than 0"),

    // ques_paper: z.instanceof(File, { message: "Question paper (ques_paper) PDF is required." })  // Required File instance
    //   .refine((file) => file.type === "application/pdf", { message: "File must be a PDF." })  // Enforce PDF type
    //   .refine((file) => file.size > 0, { message: "File cannot be empty." })  // Optional: prevent empty files
    //   .refine((file) => file.size <= 5 * 1024 * 1024, { message: "File size must be less than 5MB." }),  // Optional: size limit

    pass_percent: z.coerce
      .number()
      .min(0, "Passing percentage cannot be less than 0")
      .max(100, "Passing percentage cannot be more than 100"),



    ques_paper: z
      .any()
      .refine((file) => file instanceof File || file === undefined, {
        message: "Invalid file format",
      })
      .optional(),

    // pass_percent: z.coerce
    //   .number()
    //   .min(0, "Passing percentage cannot be less than 0")
    //   .max(100, "Passing percentage cannot be more than 100"),

    schedule_date: z.string().refine(
      (val) => {
        const date = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return (
          /^\d{4}-\d{2}-\d{2}$/.test(val) &&
          !isNaN(date.getTime()) &&
          date >= today
        );
      },
      {
        message: "Date must be today or later in YYYY-MM-DD format",
      }
    ),

    start_time: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Start time must be in HH:MM format"),

    end_time: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "End time must be in HH:MM format"),
  })
  .refine(
    ({ start_time, end_time }) => {
      const [sh, sm] = start_time.split(":").map(Number);
      const [eh, em] = end_time.split(":").map(Number);

      const start = new Date();
      start.setHours(sh, sm, 0, 0);
      const end = new Date();
      end.setHours(eh, em, 0, 0);

      return end > start;
    },
    {
      message: "End time must be later than start time",
      path: ["end_time"],
    }
  );

export const addquizpSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Maximum character should be less than 50"),
    course: z.coerce.number({
      required_error: "Course is required",
      invalid_type_error: "Course must be a number",
    }),

    subjects: z
      .array(z.coerce.number())
      .min(1, "At least one subject is required"),
    batch: z.array(z.coerce.number()).min(1, "Select at least one batch"),

    rules: z.array(z.string().min(1)).min(1)
      .optional(),

    timePerQuestion: z
      .string()
      .regex(/^\d+$/, { message: "Enter time in seconds" })
      .optional(),

    passing: z.coerce
      .number({
        required_error: "Passing percentage is required",
        invalid_type_error: "Passing percentage must be a number",
      })
      .min(0, "Passing percentage cannot be less than 0")
      .max(100, "Passing percentage cannot be more than 100"),

    qust_num: z
      .number({ invalid_type_error: "Number of question is required" })
      .int("Must be an integer")
      .positive("Must be a positive number")
      .min(0, "Number of question cannot be less than 0")
      .max(100, "Number of question cannot be more than 100"),

    date: z.string().refine(
      (val) => {
        const date = new Date(val);
        return (
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(val) && // matches datetime-local
          !isNaN(date.getTime()) &&
          date >= new Date()
        );
      },
      {
        message: "Date must be in the future (datetime-local)",
      }
    ),

    duration_hours: z.string().refine((val) => !isNaN(Number(val)), {
      message: "Hours must be a number",
    }),

    duration_minutes: z.string().refine((val) => !isNaN(Number(val)), {
      message: "Minutes must be a number",
    }),

    composition: z
      .record(z.number())
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          const total = Object.values(val).reduce((a, b) => a + b, 0);
          return Math.abs(total - 100) <= 0.5;
        },
        { message: "Composition percentages must sum to 100%" }
      ),
  })

  // ⏱ Cross-field refinement to ensure total duration is > 0
  .refine(
    (data) => {
      const h = Number(data.duration_hours);
      const m = Number(data.duration_minutes);
      return h > 0 || m > 0;
    },
    {
      message: "Duration must be at least 1 minute",
      path: ["duration_minutes"],
    }
  );
