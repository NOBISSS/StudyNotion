import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ─── Async thunk ──────────────────────────────────────────────────────────────
// Fetches subsections for a single section by its _id.
// Called from AccordionSection when the user first opens it.
export const fetchSubSections = createAsyncThunk(
    'sections/fetchSubSections',
    async (sectionId, { getState, rejectWithValue }) => {
        // ✅ Guard: if already cached, bail out immediately — no network call
        const cached = getState().sections.subSectionsBySectionId[sectionId];
        if (cached) return null; // null signals "already have data, nothing to store"

        try {
            const response = await axios.get(
                `http://localhost:3000/api/v1/subsections/getall/${sectionId}`
            );
            // Expected response shape: { success: true, data: [ ...subSections ] }
            console.log(response);
            return {
                sectionId,
                subSections: response.data?.data?.subsections ?? [],
            };
        } catch (err) {
            return rejectWithValue({ sectionId, message: err.message });
        }
    }
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const sectionSlice = createSlice({
    name: 'sections',
    initialState: {
        // { [sectionId]: SubSection[] }  — the cache
        subSectionsBySectionId: {},

        // { [sectionId]: 'idle' | 'loading' | 'error' }
        statusBySectionId: {},

        // { [sectionId]: string }  — error messages
        errorBySectionId: {},
    },
    reducers: {
        // Call this if you ever need to manually invalidate the cache
        // (e.g. after an instructor edits a section)
        invalidateSection(state, action) {
            const id = action.payload;
            delete state.subSectionsBySectionId[id];
            delete state.statusBySectionId[id];
            delete state.errorBySectionId[id];
        },
        clearAllSections(state) {
            state.subSectionsBySectionId = {};
            state.statusBySectionId     = {};
            state.errorBySectionId      = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubSections.pending, (state, action) => {
                const sectionId = action.meta.arg;
                // Only mark loading if not already cached
                if (!state.subSectionsBySectionId[sectionId]) {
                    state.statusBySectionId[sectionId] = 'loading';
                }
            })
            .addCase(fetchSubSections.fulfilled, (state, action) => {
                // null payload means cache hit — nothing to write
                if (action.payload === null) return;

                const { sectionId, subSections } = action.payload;
                state.subSectionsBySectionId[sectionId] = subSections;
                state.statusBySectionId[sectionId]      = 'idle';
                delete state.errorBySectionId[sectionId];
            })
            .addCase(fetchSubSections.rejected, (state, action) => {
                const sectionId = action.payload?.sectionId ?? action.meta.arg;
                state.statusBySectionId[sectionId] = 'error';
                state.errorBySectionId[sectionId]  = action.payload?.message ?? 'Failed to load';
            });
    },
});

export const { invalidateSection, clearAllSections } = sectionSlice.actions;
export default sectionSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectSubSections  = (sectionId) => (state) =>
    state.sections.subSectionsBySectionId[sectionId] ?? null;

export const selectSectionStatus = (sectionId) => (state) =>
    state.sections.statusBySectionId[sectionId] ?? 'idle';

export const selectSectionError  = (sectionId) => (state) =>
    state.sections.errorBySectionId[sectionId]  ?? null;