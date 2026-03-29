import { useEffect, useRef } from "react";
import { BACKEND_URL } from "../../utils/constants";

export default function VideoUploaderUppy({title, description, isPreview, sectionId, courseId}) {
  const metaRef = useRef({
    title,
    description,
    isPreview,
    sectionId,
    courseId,
  });
  useEffect(() => {
    metaRef.current = { title, description, isPreview, sectionId, courseId };
  }, [title, description, isPreview, sectionId, courseId]);
  console.log("UPPY FILE IS IN USED");
  useEffect(() => {
    // Robustly get Uppy and plugin objects from window (support multiple naming possibilities)
    const UppyGlobal = window.Uppy?.default ?? window.Uppy;
    const DashboardPlugin =
      (UppyGlobal && UppyGlobal.Dashboard) ||
      window.UppyDashboard ||
      window.UppyDashboard?.default;
    const AwsS3MultipartPlugin =
      window.UppyAwsS3Multipart ||
      (UppyGlobal && UppyGlobal.AwsS3Multipart) ||
      window.AwsS3Multipart ||
      window.Uppy?.AwsS3Multipart;

    if (!UppyGlobal) {
      console.error(
        "Uppy not found on window. Make sure CDN script is in index.html before your app script.",
      );
      return;
    }

    // Create instance (UMD exposes a Core class or a factory)
    let uppy;
    if (UppyGlobal.Core) {
      // Some UMD builds expose Uppy.Core class
      uppy = new UppyGlobal.Core({ id: "uppy", autoProceed: false });
    } else if (typeof UppyGlobal === "function") {
      // Some builds export a factory
      uppy = UppyGlobal({ id: "uppy", autoProceed: false });
    } else {
      console.error("Unrecognized Uppy shape on window:", UppyGlobal);
      return;
    }

    // Use dashboard plugin (fall back to available references)
    const Dashboard = DashboardPlugin || (UppyGlobal && UppyGlobal.Dashboard);
    if (Dashboard) {
      uppy.use(Dashboard, {
        inline: true,
        target: "#uppy-dashboard",
        showProgressDetails: true,
        note: "Select or drop large video(s).",
      });
      uppy.setMeta({ type: "video" }); // example of setting metadata for all uploads
    } else {
      console.warn(
        "Uppy Dashboard plugin not found. Dashboard UI will not render.",
      );
    }

    // Use AwsS3Multipart plugin (companion endpoints on your backend)
    if (AwsS3MultipartPlugin) {
      uppy.use(AwsS3MultipartPlugin, {
        companionUrl: BACKEND_URL+"/upload", // your backend implementing /s3/multipart endpoints
      });
    } else {
      console.warn(
        "AwsS3Multipart plugin not found. multipart uploads won't work.",
      );
    }
    uppy.on("upload", () => {
      const { title, description, isPreview, sectionId, courseId } =
        metaRef.current;
      uppy.setMeta({ title, description, isPreview, sectionId, courseId });
    });
    uppy.on("complete", (result) => {
      uppy.setMeta({
        uploadSuccess: true,
      }); // example of setting metadata for all uploads

      console.log("Uppy complete:", result);
      // result.successful -> info about uploaded files
      if (result.successful.length > 0) {
        const uploadFile = result.successful[0];

        //extracting necessary info
        const s3Key = uploadFile.response.body.key;
        const fileName = uploadFile.name;
        console.log(uploadFile);
      }
      // send that info to your backend to enqueue compression / save metadata
    });

    uppy.on("error", (err) => {
      console.error("Uppy error:", err);
    });

    // cleanup
    return () => {
      uppy.close();
    };
  }, []);

  return (
    <div id="uppy-dashboard" style={{ margin: "0 auto", width: "100%", }} />
  );
}
