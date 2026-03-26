import toast from "react-hot-toast";
import { BACKEND_URL } from "../../utils/constants";
import { apiConnector } from "../apiconnector";
import {catalogEndPoints} from "../apis";
import { setCatalogData } from "../../slices/catalogSlice";
import { useSelector } from "react-redux";

const {
    CATALOGPAGEDATA_API
} = catalogEndPoints;



// const fetchCatalogData2 = useCallback(async () => {
//         if (!catalogId) return;
//         try {
//             setIsLoading(true);
//             setError(null);

//             const response = await axios.get(
//                 CATALOGPAGEDATA_API
//             );

//             const data = response.data?.data;
//             setAllCourses(data?.selectedCategory ?? []);
//             setMostSelling(data?.mostSellingCourses ?? []);
//         } catch (err) {
//             console.error('Failed to fetch catalog data:', err);
//             setError('Something went wrong. Please try again.');
//         } finally {
//             setIsLoading(false);
//         }
//     }, [catalogId]);

// CatalogAPI.js

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