import LoadSpinner from "@/src/app/components/LoadSpinner";
import { FormEvent, useState } from "react";
import SplatForm from "../components/SplatForm";
import { handleMultipartUpload } from "../../../../lib/cloud/uploadSplatUtils/multiPartUploadUtils";
import {
  SplatUploadMetaData,
  UploadType,
} from "@/src/app/lib/definitions/SplatPayload";

interface UploadSplatModalProps {
  onSuccess: () => void;
}
export default function UploadSplatModal({ onSuccess }: UploadSplatModalProps) {
  const [isLoading, setLoading] = useState(false);
  const [isUploaded, setUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUploadSplat = async (splatPayload: FormData) => {
    try {
      setLoading(true);
      setUploadProgress(0);

      const splatFile = splatPayload.get("splatFile") as File;
      if (!splatFile) throw new Error("No Splat File selected");
      const { success: splatSuccess, key: splatKey } =
        await handleMultipartUpload(splatFile, UploadType.SPLAT);
      setUploadProgress(40);

      const videoFile = splatPayload.get("videoFile") as File;
      if (!videoFile) throw new Error("No Video File selected");
      const { success: videoSuccess, key: videoKey } =
        await handleMultipartUpload(videoFile, UploadType.VIDEO);
      setUploadProgress(80);

      const splatUploadMetaData: SplatUploadMetaData = {
        name: splatPayload.get("name") as string,
        description: splatPayload.get("description") as string,
        splatFileUrl: splatKey,
        videoFileUrl: videoKey,
      };

      const response = await fetch("/api/admin/createNewSplatEntry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(splatUploadMetaData), // Remove the wrapper object
      });
      if (!response.ok) {
        throw new Error(
          `Failed to complete multipart upload: ${response.statusText}`
        );
      }

      setUploadProgress(100);

      if (splatSuccess && videoSuccess && response.ok) {
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
    return <LoadSpinner progress={uploadProgress} />;
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
