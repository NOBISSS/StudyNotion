import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { contactUsEndpoints } from "../apis";

const { CONTACT_US_API } = contactUsEndpoints

export function ContactUs(formData, setLoading) {
  return async () => {
    const toastId = toast.loading("Sending message...");
    setLoading(true);

    try {
      const response = await apiConnector(
        "POST",
        CONTACT_US_API,
        formData
      );

      console.log("CONTACT US API RESPONSE:", response);

      if (!response?.data?.success) {
        throw new Error(response?.data?.message);
      }

      toast.success("Message sent successfully ✅");
    } catch (error) {
      console.log("ERROR:", error);

      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  };
}