import { createSlice } from '@reduxjs/toolkit';
import { logoutEmployee } from '../Api/LogoutEmployeeApi';


const EmployeeSlice = createSlice({
    name: 'logout',
    initialState: {
        token: localStorage.getItem("token"),
        accessControls: localStorage.getItem("accessControls"),
        status: 'idle',
        error: null,
    },
    reducers: {
        setToken: (state, action) => {
          state.token = action.payload;
        },
        setAccessControls: (state, action) => {
          state.accessControls = action.payload;
        },
        clearToken: (state) => {
          state.token = null;
        },
        clearAccessControls: (state) => {
          state.accessControls = null;
        },
      },
    extraReducers: (builder) => {
        builder
            .addCase(logoutEmployee.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(logoutEmployee.fulfilled, (state) => {
                state.status = 'succeeded';
                state.token = null;
                localStorage.removeItem("token");  
                localStorage.removeItem("accessControls");  
                // navigate("/");
            })
            
            .addCase(logoutEmployee.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { setToken, clearToken, setAccessControls, clearAccessControls } = EmployeeSlice.actions;
export default EmployeeSlice.reducer;
