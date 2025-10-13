import { createAsyncThunk } from "@reduxjs/toolkit";

let token = localStorage.getItem("token");

const BASE_URL = import.meta.env.VITE_BASE_URL;


export const fetchCategories = createAsyncThunk(
    "category/fetchCategories",
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch(`${BASE_URL}/api/v1/category/fetch`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();

            if (!res.ok) {
                return rejectWithValue(data)
            }

            return data; // return to reducer
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);