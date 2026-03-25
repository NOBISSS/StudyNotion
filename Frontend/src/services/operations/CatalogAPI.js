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

export function fetchCatalogData(
  catalogId,
  setError,
  setAllCourses,
  setMostSelling,
  setLoading
) {
  return async (dispatch, getState) => {
    const toastId = toast.loading("Loading...");

    try {
      const state = getState();
      const existingData = state.catalog.catalogData[catalogId];

      // 🔥 CACHE HIT → DO NOT CALL API
      if (existingData) {
        console.log("Using cached data");

        setAllCourses(existingData?.selectedCategory ?? []);
        setMostSelling(existingData?.mostSellingCourses ?? []);
        return;
      }

      // 🔥 API CALL (only if not cached)
      setLoading(true);

      const response = await apiConnector(
        "GET",
        CATALOGPAGEDATA_API + catalogId
      );

      if (!response?.data?.success) {
        throw new Error(response.data.message);
      }

      const data = response.data?.data;

      // 🔥 Store in Redux with ID
      dispatch(
        setCatalogData({
          catalogId,
          data,
        })
      );

      setAllCourses(data?.selectedCategory ?? []);
      setMostSelling(data?.mostSellingCourses ?? []);
    } catch (error) {
      console.log("GET CATALOG DATA API ERROR", error);
      setError(error?.message || error);
      toast.error("GET CATALOG DATA Failed");
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };
}