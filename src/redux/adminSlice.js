import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// const baseURL = 'http://localhost:5000/api/admin';
const baseURL = "https://treatline-vha-backend.vercel.app/api/admin"

export const adminLogin = createAsyncThunk(
    'admin/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${baseURL}/login`, { email, password });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getUnverifiedDoctors = createAsyncThunk(
    'admin/getUnverifiedDoctors',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${baseURL}/unverifiedDoctors`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchDoctorByID = createAsyncThunk(
    'admin/fetchDoctorByID',
    async (doctorId, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${baseURL}/doctor/` ,{doctorId}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getVerifiedDoctors = createAsyncThunk(
    'admin/getVerifiedDoctors',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${baseURL}/verifiedDoctors`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const verifyDoctor = createAsyncThunk(
    'admin/verifyDoctor',
    async (doctorId, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${baseURL}/verifyDoctor`, { doctorId }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null,
        unverifiedDoctors: [],
        doctor: null,
        verifiedDoctors: [],
    },
    reducers: {
        logout: (state) => {
            state.token = null;
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(adminLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(adminLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getUnverifiedDoctors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUnverifiedDoctors.fulfilled, (state, action) => {
                state.loading = false;
                state.unverifiedDoctors = action.payload.doctors;
            })
            .addCase(getUnverifiedDoctors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchDoctorByID.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDoctorByID.fulfilled, (state, action) => {
                state.loading = false;
                state.doctor = action.payload.doctor;
            })
            .addCase(fetchDoctorByID.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getVerifiedDoctors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getVerifiedDoctors.fulfilled, (state, action) => {
                state.loading = false;
                state.verifiedDoctors = action.payload.doctors;
            })
            .addCase(getVerifiedDoctors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(verifyDoctor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyDoctor.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(verifyDoctor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = adminSlice.actions;
export default adminSlice.reducer;
