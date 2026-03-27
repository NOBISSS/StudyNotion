import { createSlice } from "@reduxjs/toolkit";

const catalogSlice = createSlice({
  name: "catalog",
  initialState: {
    catalogData: {},
  },
  reducers: {
    setCatalogData(state, action) {
      const { catalogId, data } = action.payload;

      state.catalogData[catalogId] = data; // store per ID
    },
  },
});

export const { setCatalogData } = catalogSlice.actions;
export default catalogSlice.reducer;