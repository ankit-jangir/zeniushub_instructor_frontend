import { createAsyncThunk } from "@reduxjs/toolkit";
const BASE_URL = import.meta.env.VITE_BASE_URL;

// get exam all
export const fetchexam = createAsyncThunk(
  "exam/fetchexams",
  async ({ sesion_id, exam_name, page, limit, token }, { rejectWithValue }) => {
    try {
      const responce = await fetch(
        `${BASE_URL}/api/v1/exams/get-exams?session_id=${sesion_id}&exam_name=${exam_name}&page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await responce.json();
      if (!responce.ok) {

        // return rejectWithValue(result);
      }

      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// add exam

export const addExam = createAsyncThunk(
  "exam/addExam",
  async ({ examData, token }, { rejectWithValue }) => {
    try {
      const responce = await fetch(`${BASE_URL}/api/v1/exams/add-exam`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: examData, // ✅ this must be FormData (not JSON)
      });

      const result = await responce.json();
      if (!responce.ok) {

        return rejectWithValue(result);
      }

      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// exam history get
export const fetchExamHistory = createAsyncThunk(
  "exam/fetchExamHistory",
  async (
    { token, session_id, category_name, status, page, limit },
    { rejectWithValue }
  ) => { 
    try {
      const filteredStatus = status === "All" ? "" : status;

      const url = `${BASE_URL}/api/v1/exams/exam-history?session_id=${session_id}&category_name=${category_name}&status=${filteredStatus}&page=${page}&limit=${limit}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!response.ok) {

        // return rejectWithValue(result);
      }

      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// get data by id
export const fetchBatchDetailsById = createAsyncThunk(
  "exams/fetchBatchDetailsById",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/exams/clicktobatchdetails?id=${id}`,
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

// delete api 

export const deleteExam = createAsyncThunk(
  'exams/deleteExam',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/exams/deleteexam?id=${id}`,
        {
          method: 'DELETE',
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



export const fetchExamss = createAsyncThunk(
  "exams/fetchExamss",
  async ({ sessionId, batchId, page, limit, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/exams/by-session-batch?sessionId=${sessionId}&batchId=${batchId}&page=${page}&limit=${limit}`, {

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




export const fetchExamsByBatchId = createAsyncThunk(
  "exams/fetchExamsByBatchId",
  async ({ batchId, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/exams/exam_batch_id/${batchId}`, {
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




export const saveExamResult = createAsyncThunk(
  "exam/saveResult",
  async ({ examId, results, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/exams/save-result/${examId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ results }),
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



export const fetchStudentExamDetails = createAsyncThunk(
  "exam/fetchStudentExamDetails",
  async ({ Student_Enrollment_id, page = 1, pageSize = 6 , token}, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/exams/getOnestudentExamDetails?Student_Enrollment_id=${Student_Enrollment_id}&page=${page}&pageSize=${pageSize}`,{
            headers: {
          Authorization: `Bearer ${token}`,
        },
        }
      );
      const data = await res.json();

      if (res.ok) {
        // return rejectWithValue(data);
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);