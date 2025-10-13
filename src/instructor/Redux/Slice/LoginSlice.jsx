import { createSlice } from '@reduxjs/toolkit';
import loginEmployee from '../Api/LoginApi';


const loginSlice = createSlice({
    name: 'login',
    initialState: {

        token: null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.token = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload;
            })
            .addCase(loginEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
