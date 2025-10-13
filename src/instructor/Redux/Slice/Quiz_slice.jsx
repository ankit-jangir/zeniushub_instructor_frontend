// features/quizz/quizzSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { addQuestion, fetchQuizzes, createQuiz, deleteQuiz, fetchQuestionPapers, fetchQuizHistory, fetchQuizz, get_batch, get_course, get_quiz_by_id, get_subject, uploadQuestionPaper, fetchAllQuestions, getDeclaredResult, fetchStudentQuizDetails } from "../Api/Quiz_api";

const quizzSlice = createSlice({
  name: "quizz",
  initialState: {

    loading: false,
    data: [],
    quiz: [],
    course: [],
    subject: [],
    batch: [],
    error: null,
    quizBatch: [],
    total: 0,
    loadingBatchQuiz: false,
    currentPage: 1,
    pageSize: 6,
    totalPages: 0,
    questions: [],
    questionsLoading: false,
    questionsError: null,
    declaredResult: [],
    loading: false,
    error: null,
    pagination: {
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      limit: 12
    },
    questionsPagination: {
      currentPage: 1,
      limit: 10,
      totalRecords: 0,
      totalPages: 0,
    },

    quizDetails: [],
    loadingSQ: false,
    countsQ: {},
    pagination: {},
    studentQ: {}
  },



  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {

    builder
      .addCase(fetchQuizz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizz.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchQuizz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });



    // get sinfle quid detail
    builder
      .addCase(get_quiz_by_id.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(get_quiz_by_id.fulfilled, (state, action) => {
        state.loading = false;
        state.quiz = action.payload;
      })
      .addCase(get_quiz_by_id.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });




    // add quiz
    builder
      .addCase(createQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.createdQuiz = action.payload;
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });



    //get_course
    builder
      .addCase(get_course.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(get_course.fulfilled, (state, action) => {
        state.loading = false;
        state.course = action.payload?.data;
      })
      .addCase(get_course.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });



    builder
      .addCase(get_subject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(get_subject.fulfilled, (state, action) => {
        state.loading = false;
        state.subject = action?.payload?.data;
      })
      .addCase(get_subject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });



    builder
      .addCase(get_batch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(get_batch.fulfilled, (state, action) => {
        state.loading = false;
        state.batch = action?.payload?.data?.batches;
      })
      .addCase(get_batch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


    // quiz history
    builder
      .addCase(fetchQuizHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchQuizHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
      })


      // delete api 
      .addCase(deleteQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.id;
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.data = false;
      })



    // get all histoy quiz
    builder
      .addCase(fetchQuestionPapers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.data = { data: [] };
      })
      .addCase(fetchQuestionPapers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = { data: action.payload.data };
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchQuestionPapers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.data = { data: [] };
      })



      // New reducers for uploadQuestionPaper
      .addCase(uploadQuestionPaper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadQuestionPaper.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(uploadQuestionPaper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // Add reducers for fetchAllQuestions
      .addCase(fetchAllQuestions.pending, (state) => {
        state.questionsLoading = true;
        state.questionsError = null;
      })
      .addCase(fetchAllQuestions.fulfilled, (state, action) => {
        state.questionsLoading = false;
        state.questions = action.payload.data || [];
        state.questionsPagination = {
          currentPage: action.payload.currentPage || 1,
          limit: action.payload.limit || 10,
          totalRecords: action.payload.totalRecords || 0,
          totalPages: action.payload.totalPages || 1,
        };
      })
      .addCase(fetchAllQuestions.rejected, (state, action) => {
        state.questionsLoading = false;
        state.questionsError = action.payload || "Failed to fetch questions";
      });






    // builder
    //   .addCase(addQuestion.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(addQuestion.fulfilled, (state, action) => {
    //     state.loading = false;
    //   })
    //   .addCase(addQuestion.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   });

    builder
      .addCase(addQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = [...state.questions, action.payload]; // New question add karo
      })
      .addCase(addQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });




    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.loadingBatchQuiz = true;
        state.quizBatch = [];
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        console.log("API Response:", action.payload);
        state.loadingBatchQuiz = false;
        state.quizBatch = action.payload?.data?.quizzes.slice(0, 6) || [];
        state.total = action.payload?.data?.pagination?.totalRecords || 0;
        state.currentPage = action.payload?.data?.pagination?.currentPage || 1;
        state.pageSize = action.payload?.data?.pagination?.pageSize || 6;
        state.totalPages = action.payload?.data?.pagination?.totalPages || 1;
      })
      .addCase(fetchQuizzes.rejected, (state) => {
        state.loadingBatchQuiz = false;
        state.quizBatch = [];
      });


   builder
  .addCase(getDeclaredResult.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(getDeclaredResult.fulfilled, (state, action) => {
    state.loading = false;
    state.declaredResult = action.payload;
  })
  .addCase(getDeclaredResult.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload?.error?.[0]?.message || action.payload?.message || "Something went wrong";
    state.declaredResult = { data: [] }; 
  });




    builder
      .addCase(fetchStudentQuizDetails.pending, (state) => {
        state.loadingSQ = true;
        state.error = null;
      })
      .addCase(fetchStudentQuizDetails.fulfilled, (state, action) => {
        state.loadingSQ = false;
        state.quizDetails = action.payload.studentDetails.results;
        state.studentQ = action.payload.studentDetails.student;
        state.countsQ = action.payload.studentDetails.counts;
        state.pagination = action.payload.studentDetails.pagination;
      })
      .addCase(fetchStudentQuizDetails.rejected, (state, action) => {
        state.loadingSQ = false;
        state.error = action.error.message;
      });


  },
});

export const { setPage } = quizzSlice.actions;
export default quizzSlice.reducer;
