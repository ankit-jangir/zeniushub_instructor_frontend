import { createAsyncThunk } from "@reduxjs/toolkit";
let token = localStorage.getItem("token");
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchEmployeeSalary = createAsyncThunk(
    "employee/fetchSalary",
    async (salary, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${BASE_URL}/api/v1/instructor/employesalery?employesalery=${salary}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );
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
