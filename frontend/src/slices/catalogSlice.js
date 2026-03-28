import { createSlice } from "@reduxjs/toolkit";

const catalogSlice = createSlice({
  name: "catalog",
  initialState: {
    catalogData: {},
    categories:[],
  },
  reducers: {
    setCatalogData(state, action) {
      const { catalogId, data } = action.payload;

      state.catalogData[catalogId] = data; // store per ID
    },
    setCategories(state,action){
      state.categories=action.payload;
    }
  },
});

export const { setCatalogData,setCategories } = catalogSlice.actions;
export default catalogSlice.reducer;