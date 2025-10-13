import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "https://instructorv2-api-dev.intellix360.in";

export const fetchEmiSummary = createAsyncThunk(
  "emi/fetchEmiSummary",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/emi/emis/today-summary`,
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

export const EmiBreakdownByDate = createAsyncThunk(
  "emi/EmiBreakdownByDate",
  async ({ month, year, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/emi/getEmisTotalAmounts?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data.data.breakdown;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// EMI .....API
export const getUpcomingEmis = createAsyncThunk(
  "emi/getUpcomingEmis",
  async (
    { fromDate, toDate, status, courseId, batchId, page, limit, token },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/emi/emis?fromDate=${fromDate}&toDate=${toDate}&status=${status}&courseId=${courseId}&batchId=${batchId}&page=${page}&limit=${limit}`,
        {
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

// Excel Download
export const downloadEmiExcel = createAsyncThunk(
  "emi/downloadExcel",
  async (
    { fromDate, toDate, status, courseId = "", batchId = "", token },
    { rejectWithValue }
  ) => {
    const url = `${BASE_URL}/api/v1/emi/emis/download/excel?fromDate=${fromDate}&toDate=${toDate}&status=${status}&courseId=${courseId}&batchId=${batchId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "emi_received.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);

    return true;
  }
);

export const updateEmiPayment = createAsyncThunk(
   "emi/update",
  async ({token, emi_id, payment_date}, {rejectWithValue}) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/emi/emis/update-payment?emi_id=${emi_id}&payment_date=${payment_date}`,
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



