import toast from "react-hot-toast";
import { subSectionMaterialEndpoints, subSectionVideoEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";

const { PUT_MARK_SUBSECTION_COMPLETED_API, POST_SAVE_VIDEO_PROGRESS_API,GET_SUBSECTION_DETAILS_API } =
  subSectionVideoEndpoints;
export const markSubsectionAsCompleted = async (subsectionId, toggle = false) => {
  const toastId = toast.loading("Marking subsection as completed...");
  let result = null;
  try {
    const url = PUT_MARK_SUBSECTION_COMPLETED_API.replace(":subsectionId", subsectionId) + `?toggle=${toggle}`;
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
export const saveVideoProgress = async (subsectionId, currentTime) => {
  let result = null;
  try {
    const url = POST_SAVE_VIDEO_PROGRESS_API;
    const response = await apiConnector("POST", url, { currentTime, subsectionId });
    if (!response?.data?.success) throw new Error("Could not save video progress");
    result = response.data.data;
  } catch (error) {
    console.error("Failed to save video progress:", error);
  }
  return result;
};
export const getVideo = async (subsectionId) => {
  let result = null;
  try {
    const url = GET_SUBSECTION_DETAILS_API.replace(":subsectionId", subsectionId);
    const response = await apiConnector("GET", url);
    if (!response?.data?.success) throw new Error("Could not fetch video details");
    result = response.data.data;
  } catch (error) {
    console.error("Failed to fetch video details:", error);
  }
  return result;
};