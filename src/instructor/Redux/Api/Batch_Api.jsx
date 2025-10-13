import { createAsyncThunk } from "@reduxjs/toolkit";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchBatchesBySession = createAsyncThunk(
  "batch/fetchBatchesBySession",
  async ({ sessionId, search, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/batch?sessionId=${sessionId}&search=${search || ""
        }`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        const errorMessage =
          result?.error?.[0]?.message ||
          result?.message ||
          "Something went wrong";
        return rejectWithValue(errorMessage);
      }

      const batches = result.data;
      return batches;
    } catch (error) {
      return rejectWithValue(
        error?.errorMessage || "Something went wrong. Please try again."
      );
    }
  }
);

export const fetchBatchDetails = createAsyncThunk(
  "batch/fetchBatchDetails",
  async ({ id, token, SessionId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/batch/batchById?id=${id}&SessionId=${SessionId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBatchesByCourse = createAsyncThunk(
  "batch/fetchBatchesByCourse",
  async ({ courseId, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/batch/${courseId}`, {
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

export const fetchCourseById = createAsyncThunk(
  "course/fetchCourseById",
  async ({ courseId, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/studentEnrollment/getCourse/${courseId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        const errorMessage =
          result?.error?.[0]?.message ||
          result?.message ||
          "Something went wrong";
        return rejectWithValue(errorMessage);
      }

      return result.data;
    } catch (error) {
      return rejectWithValue(
        error?.message || "Something went wrong. Please try again."
      );
    }
  }
);

export const fetchBatchesByCourseId = createAsyncThunk(
  "batch/fetchByCourseId",
  async ({idcourse, token}, { rejectWithValue }) => {
    try {
      const baseUrl =
        "https://instructorv2-api-dev.intellix360.in/api/v1/batch/getallbatchescontroller";
        

      const url = idcourse ? `${baseUrl}?course_id=${idcourse}` : baseUrl;

      const response = await fetch(url, {
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
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch batches"
      );
    }
  }
);

export const getSession = createAsyncThunk(
  "session/getSession",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/studentEnrollment/getSession`,
        {

          headers: {

            Authorization: `Bearer ${token}`,
          },
        }
      );


      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data)
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const promoteStudents = createAsyncThunk(
  "promotion/promoteStudents",
  async ({ payload, token }, { rejectWithValue }) => {
    //  payload = {
    //   ...payload,
    //   course_id:40,
    //   batch_id:71,
    //   session_id:1
    // }
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/studentEnrollment/PromoteStudent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data?.message || "Failed to promote students");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error?.message || "Network Error");
    }
  }
);




export const fetchAssignBatchSubject = createAsyncThunk(
  "assignBatchSubject/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); 

      const response = await fetch(
        `${BASE_URL}/api/v1/instructor/assignbatchsubject`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
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