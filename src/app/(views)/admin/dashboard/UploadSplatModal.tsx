import LoadSpinner from "@/src/app/components/LoadSpinner";
import { FormEvent, useState } from "react";
import SplatForm from "./components/SplatForm";
import { handleMultipartUpload } from "./uploadSplatUtils/multiPartUploadUtils";
import { SplatUploadMetaData } from "@/src/app/lib/definitions/SplatPayload";

interface UploadSplatModalProps {
  onSuccess: () => void;
}
export default function UploadSplatModal({ onSuccess }: UploadSplatModalProps) {
  const [isLoading, setLoading] = useState(false);
  const [isUploaded, setUploaded] = useState(false);

  const handleUploadSplat = async (splatPayload: FormData) => {


    try {
      setLoading(true);
      const splatFile = splatPayload.get("splatFile") as File;
      if (!splatFile) throw new Error("No Splat File selected");
      const { success: splatSuccess, location: splatLocationUrl } = await handleMultipartUpload(splatFile, "splat");

      const videoFile = splatPayload.get("videoFile") as File;
      if (!videoFile) throw new Error("No Video File selected");
      const { success: videoSuccess, location: videoLocationUrl} = await handleMultipartUpload(videoFile, "video");

      const splatUploadMetaData: SplatUploadMetaData = {
        name: splatPayload.get("name") as string,
        description: splatPayload.get("description") as string,
        splatFileUrl: splatLocationUrl,
        videoFileUrl: videoLocationUrl,
      }

      const response = await fetch("/api/admin/createNewSplatEntry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          splatUploadMetaData
        })
    });
    if (!response.ok) {
        throw new Error(`Failed to complete multipart upload: ${response.statusText}`);
    }
  
      
      if (splatSuccess && videoSuccess) {
        setUploaded(true);
        onSuccess?.();
      } else {
        throw new Error("Multipart upload failed");
      }
      
  } catch (error) {
      console.error("Upload failed:", error);
      throw error;
  } finally {
      setLoading(false);
  }
  return true;

    // const response = await fetch("/api/admin/uploadSplat", {
    //   method: "POST",
    //   body: splatPayload,
    // });
    // if (!response.ok) {
    //   const payload = await response.json();
    //   throw new Error(payload["error"]);
    // }
    // return response.ok;
  return true;
  };

  const handleURLSubmit = async (formEvent: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    try {
      formEvent.preventDefault();

      const formData = new FormData(formEvent.currentTarget);

      if (
        !formData.get("name") ||
        formData.get("name")?.toString().trim().length == 0
      ) {
        throw new Error("Splat Name not provided.");
      }

      if (!formData.get("splatFile")) {
        throw new Error("Splat File not provided.");
      }

      if (!formData.get("videoFile")) {
        throw new Error("Video File not provided.");
      }

      const result = await handleUploadSplat(formData);
      if (result) {
        setUploaded(true);
        onSuccess();
        console.log("Splat upload successful!");
      }
    } catch (error) {
      console.error(`Upload Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <LoadSpinner />;
  } else {
    if (isUploaded) {
      return (
        <>
          <div className="p-8 flex flex-col items-center justify-center">
            <h3 className="text-base font-semibold text-teal-500">
              Splat has been uploaded!
            </h3>
          </div>
        </>
      );
    } else {
      return (
        <SplatForm submitBtnLabel="Upload" onSubmitCallback={handleURLSubmit} />
      );
    }
  }
}
