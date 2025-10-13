// import { createSlice } from '@reduxjs/toolkit';
// import { fetchAllTasksForDashboard } from '../Api/DashboardApi';
// // import { fetchAllTasksForDashboard } from './taskActions';

// const initialState = {
//   tasks: [],
//   loading: false,
//   error: null,
// };

// const taskSlice = createSlice({
//   name: 'tasks',
//   initialState,
//   reducers: {
//     clearTasks: (state) => {
//       state.tasks = [];
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAllTasksForDashboard.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllTasksForDashboard.fulfilled, (state, action) => {
//         state.loading = false;
//         state.tasks = action.payload;
//       })
//       .addCase(fetchAllTasksForDashboard.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || 'Failed to fetch tasks';
//       });
//   },
// });

// export const { clearTasks } = taskSlice.actions;
// export default taskSlice.reducer;


import { createSlice } from '@reduxjs/toolkit';
import { fetchAllTasksForDashboard, updateTaskStatus } from '../Api/DashboardApi';

const initialState = {
  tasks: null, // Should be `null` or an object to match the API shape
  loading: false,
  error: null,
  updateStatusLoading: false,
  updateStatusError: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTasks: (state) => {
      state.tasks = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ✅ FETCH TASKS
    builder
      .addCase(fetchAllTasksForDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTasksForDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchAllTasksForDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch tasks';
      });

    // ✅ UPDATE TASK STATUS
    builder
      .addCase(updateTaskStatus.pending, (state) => {
        state.updateStatusLoading = true;
        state.updateStatusError = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.updateStatusLoading = false;

        // Update the task in the list if available
        const updatedTask = action.payload?.updatedTask;
        if (updatedTask && state.tasks?.data) {
          const index = state.tasks.data.findIndex((t) => t.id === updatedTask.id);
          if (index !== -1) {
            state.tasks.data[index] = updatedTask;
          }
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.updateStatusLoading = false;
        state.updateStatusError = action.payload || 'Failed to update task status';
      });
  },
});

export const { clearTasks } = taskSlice.actions;
export default taskSlice.reducer;
