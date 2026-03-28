import toast from "react-hot-toast";
import { BACKEND_URL } from "../../utils/constants";
import { apiConnector } from "../apiconnector";
import {catalogEndPoints, categories} from "../apis";
import { setCatalogData, setCategories } from "../../slices/catalogSlice";
import { useSelector } from "react-redux";

const {
    CATALOGPAGEDATA_API
} = catalogEndPoints;

const {
  CATEGORIES_API
}=categories

export function fetchCatalogData(catalogId) {
  return async (dispatch, getState) => {
    const toastId = toast.loading("Loading...");

    try {
      const state = getState();
      const existingData = state.catalog.catalogData[catalogId];

      if (existingData) {
        console.log("Using cached data");
        toast.dismiss(toastId);
        return;
      }

      const response = await apiConnector(
        "GET",
        CATALOGPAGEDATA_API + catalogId
      );

      if (!response?.data?.success) {
        throw new Error(response.data.message);
      }

      const data = response.data?.data;

      dispatch(
        setCatalogData({
          catalogId,
          data,
        })
      );
    } catch (error) {
      console.log("GET CATALOG DATA API ERROR", error);
      toast.error(error?.message || "Failed to load catalog");
    } finally {
      toast.dismiss(toastId);
    }
  };
}

export function fetchAllCategories(){
  return async (dispatch)=>{
  try {
    const response = await apiConnector("GET", CATEGORIES_API);

    if (!response?.data?.success) {
      throw new Error(response.data.message);
    }
    const categories=response.data.data.category;

    dispatch(setCategories(categories));
  } catch (error) {
    console.log("FETCH CATEGORY ERROR", error);
    throw error;
  }
}
};