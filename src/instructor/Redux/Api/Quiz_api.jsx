// features/quizz/quizzApi.js
import { createAsyncThunk } from "@reduxjs/toolkit";
const BASE_URL = import.meta.env.VITE_BASE_URL;


export const fetchQuizz = createAsyncThunk(
  "quizz/fetchQuizzBySession",
  async ({ token, title, page, limit, session_id }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/Quizz/showquizz?title=${title}&page=${page}&limit=${limit}&session_id=${session_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errordata = await response.json();
        return rejectWithValue(errordata);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);



// quiz history 

export const fetchQuizHistory = createAsyncThunk(
  'quiz/fetchQuizHistory',
  async ({ token, page = 1, limit = 10, session_id = 13 }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/Quizz/quiz-history?page=${page}&limit=${limit}&session_id=${session_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );

      if (!response.ok) {
        const errordata = await response.json();
        return rejectWithValue(errordata);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);




// fetch quiz by id
export const get_quiz_by_id = createAsyncThunk(
  "getquizz/getquizbyid",
  async ({ id, token }, { rejectWithValue }) => {
    console.log(id, "!!!!!!!!!!!!!");

    try {
      const response = await fetch(`${BASE_URL}/api/v1/Quizz/quiz/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errordata = response.json();
        return rejectWithValue(errordata);
      }
      const result = await response.json();
      console.log(result, "result");

      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);




// add quiz
export const createQuiz = createAsyncThunk(
  "quiz/createQuiz",
  async ({ quizData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/Quizz/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(quizData),
      });

      const result = await response.json();
      if (!response.ok) {
        return rejectWithValue(result);
      }

      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);



// get_course

export const get_course = createAsyncThunk(
  "getcourse",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/instructor/EmpBatch`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result);
      }

      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



//getsubject
export const get_subject = createAsyncThunk(
  "getsubject",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/instructor/Empsubject?course_id=${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result);
      }

      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



//get_batch
export const get_batch = createAsyncThunk(
  "getbatch",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/instructor/EmpBatch?course_id=${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result);
      }

      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



// quiz delete
export const deleteQuiz = createAsyncThunk(
  'quiz/deleteQuiz',
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/Quizz/quizdelete/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      const result = await response.json();
      if (!response.ok) {
        return rejectWithValue(result);
      }

      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);



// get all question paper 

export const fetchQuestionPapers = createAsyncThunk(
  "questionPapers/fetchQuestionPapers",
  async ({ token, page = 1, limit = 12 }, { rejectWithValue }) => {
    try {
      if (!token) {
        console.error("Token is missing!");
        return rejectWithValue("Token is required");
      }

      console.log("Fetching question papers with token:", token);
      const response = await fetch(
        `${BASE_URL}/api/v1/Question/question-papers?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      console.log("API Response:", result);

      if (!response.ok) {
        console.error("API Error:", result.message);
        return rejectWithValue(result.message || "Failed to fetch question papers");
      }

      const data = Array.isArray(result.data) ? result.data : [];
      console.log("Fetched Data:", data);

      return {
        data,
        pagination: result.pagination || { page, limit, totalItems: data.length },





      };
    } catch (error) {
      console.error("Network Error:", error.message);
      return rejectWithValue(error.message || "Network error");
    }
  }
);


//  API for uploading Excel question paper
export const uploadQuestionPaper = createAsyncThunk(
  "quiz/uploadQuestionPaper",
  async ({ token, subject_id, course_id, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("subject_id", subject_id);
      formData.append("course_id", course_id);
      formData.append("file", file);

      const response = await fetch(`${BASE_URL}/api/v1/Question/QuestionCreate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        return rejectWithValue(result);
      }

      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);





export const addQuestion = createAsyncThunk(
  "quiz/addQuestion",
  async ({ token, questionData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("question", questionData.question);
      formData.append("option1", questionData.option1);
      formData.append("option2", questionData.option2);
      formData.append("option3", questionData.option3);
      formData.append("option4", questionData.option4);
      formData.append("answer", questionData.answer);
      formData.append("subject_id", questionData.subject_id);
      formData.append("course_id", questionData.course_id);

      if (questionData.file) {
        formData.append("file", questionData.file);
        // formData.append("img", questionData.img[0]); 
      }

      const response = await fetch(
        `${BASE_URL}/api/v1/Question/upload/Ques`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errordata = await response.json();
        return rejectWithValue(errordata);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }

);




// Fetch all questions for a specific course and subject
export const fetchAllQuestions = createAsyncThunk(
  "questions/fetchAllQuestions",
  async ({ token, course_id, subject_id, page = 1, limit = 10, search = '' }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/Question/allcoursegetapi?courseid=${course_id}&subject_id=${subject_id}&page=${page}&limit=${limit}&search=${search}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errordata = await response.json();
        return rejectWithValue(errordata);
      }

      const result = await response.json();
      console.log(result, "result  dxfcgvhbjnkml,;")
      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);





export const fetchQuizzes = createAsyncThunk(
  "quizzes/fetchQuizzes",
  async ({ sessionId, batchId, page = 1, pageSize = 6, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/Quizz/quizzes?sessionId=${sessionId}&batchId=${batchId}&page=${page}&pageSize=${pageSize}`, {

        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
      );
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);


export const getDeclaredResult = createAsyncThunk(
  "quizz/getDeclaredResult",
  async ({ sessionId, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/Quizz/declaredResult?sessionId=${sessionId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);




export const fetchStudentQuizDetails = createAsyncThunk(
  "quiz/fetchStudentQuizDetails",
  async ({ Student_Enrollment_id, page, pageSize, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/exams/getOnestudentQuizDetails?Student_Enrollment_id=${Student_Enrollment_id}&page=${page}&pageSize=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }


      return data;
    } catch (error) {

      return rejectWithValue(error.message);
    }
  }
);