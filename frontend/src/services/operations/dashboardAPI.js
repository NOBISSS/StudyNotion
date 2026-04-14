import toast from "react-hot-toast";
import { dashboardEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";

const { INSTRUCTOR_DASHBOARD_API, STUDENT_DASHBOARD_API } = dashboardEndpoints;

export const instructorDashboard = async () => {
  const toastId = toast.loading("Fetching instructor dashboard details...");
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      INSTRUCTOR_DASHBOARD_API
    );
    if (!response?.data?.success)
      throw new Error("Could not fetch instructor dashboard details");
    result = response?.data?.data || [];
    return result;
  } catch (error) {
    toast.error(error.message || "Failed to fetch instructor dashboard details");
  } finally {
    toast.dismiss(toastId);
  }
};
export const studentDashboard = async () => {
  const toastId = toast
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      STUDENT_DASHBOARD_API
    );
    if (!response?.data?.success)
      throw new Error("Could not fetch student dashboard details");
    result = response?.data?.data || [];
    return result;
  } catch (error) {
    toast.error(error.message || "Failed to fetch student dashboard details");
  } finally {
    toast.dismiss(toastId);
  }
};
