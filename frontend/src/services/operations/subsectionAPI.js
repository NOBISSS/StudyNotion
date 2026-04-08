import toast from "react-hot-toast";
import { subSectionVideoEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";

const {PUT_MARK_SUBSECTION_COMPLETED_API} = subSectionVideoEndpoints;
export const markSubsectionAsCompleted = async (subsectionId) => {
  const toastId = toast.loading("Marking subsection as completed...");
  let result = null;
  try {
    const url = PUT_MARK_SUBSECTION_COMPLETED_API.replace(":subsectionId", subsectionId);
    const response = await apiConnector("PUT", url);
    if (!response?.data?.success) throw new Error("Could not mark subsection as completed");
    result = response.data.data;
  } catch (error) {
    toast.error(error.message || "Failed to mark subsection as completed");
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};
