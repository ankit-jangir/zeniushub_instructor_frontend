import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;


export const fetchAssignmentsUpcoming = createAsyncThunk(
  "assignments/fetchAssignmentsUpcoming",
  async ({ token, payload }, { rejectWithValue }) => {


    try {
      const url = `${BASE_URL}/api/v1/assignment/upcominggetby?limit=${payload.limit}&page=${payload.page}&title=${payload.title}&session_id=${payload.session_id}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data)
      }
      return data;

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const fetchAssignmentsHistory = createAsyncThunk(
  "assignments/fetchAssignmentsHistory",
  async ({ token, payload }, { rejectWithValue }) => {
    try {
      const url = `${BASE_URL}/api/v1/assignment/historygetby?limit=${payload.limit}&page=${payload.page}&title=${payload.title}&session_id=${payload.session_id}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });



      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data)
      }
      return data;

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addAssignment = createAsyncThunk(
  "assignment/addAssignment",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/assignment/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "multipart/form-data",
        },
        body: data,
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


export const fetchBatchByAssignmentId = createAsyncThunk(
  'assignment/fetchBatchByAssignmentId',
  async ({ assignmentId, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/assignment/getbatchbyassignmentid/${assignmentId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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



export const getResultByBatchAssignmentId = createAsyncThunk(
  "result/getResultByBatchAssignmentId",
  async ({ batchAssignmentId, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/assignment/getresultbybatchassignmentid/${batchAssignmentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);


export const declareResults = createAsyncThunk(
  "resultDeclare/declareResults",
  async ({ updatedResultSheet, token }, { rejectWithValue }) => {

    try {

      const resultSheet = updatedResultSheet.map(item => ({
        ...item,
        obtained_marks:
          item.obtained_marks !== null
            ? Number(item.obtained_marks)
            : null,
      }));

      const res = await fetch(`${BASE_URL}/api/v1/assignment/resultdeclare`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ resultSheet }),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const fetchStudentResultAssignmentDetails = createAsyncThunk(
  "studentResult/fetchStudentResultAssignmentDetails",
  async ({ Student_Enrollment_id, page, pageSize, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/exams/getOneStudentResultAssignmentDetails?Student_Enrollment_id=${Student_Enrollment_id}&page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
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



export const fetchAssignmentsByBatch = createAsyncThunk(
  "assignments/fetchByBatch",
  async ({ id, sessionId, page, limit, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/batch/assignment-by-batch?batchId=${id}&sessionId=${sessionId}&page=${page}&limit=${limit}`, {

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