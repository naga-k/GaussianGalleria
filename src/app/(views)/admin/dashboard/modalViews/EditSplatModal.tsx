import LoadSpinner from "@/src/app/components/LoadSpinner";
import { FormEvent, useState } from "react";
import SplatForm from "../components/SplatForm";
import { handleMultipartUpload } from "@/src/app/lib/cloud/uploadSplatUtils/multiPartUploadUtils";
import {
  SplatEditMetaData,
  UploadType,
} from "@/src/app/lib/definitions/SplatPayload";

type SplatPrefillData = {
  id: number;
  name: string;
  description?: string;
};

interface EditModalProps {
  splatData: SplatPrefillData;
  onSuccess: () => void;
}

export default function EditSplatModal({
  splatData,
  onSuccess,
}: EditModalProps) {
  const [isLoading, setLoading] = useState(false);
  const [isEdited, setEdited] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleEditSplat = async (splatPayload: FormData) => {
    try {
      setLoading(true);
      setUploadProgress(0);

      const splatFile = splatPayload.get("splatFile") as File;
      let splatSuccess: boolean = false;
      let splatLocationUrl: string | null = null;
      if (splatFile.size > 0) {
        const result = await handleMultipartUpload(splatFile, UploadType.SPLAT);
        splatSuccess = result.success;
        splatLocationUrl = result.key;
      }
      setUploadProgress(40);

      const videoFile = splatPayload.get("videoFile") as File;
      let videoSuccess: boolean = false;
      let videoLocationUrl: string | null = null;
      if (videoFile.size > 0) {
        const result = await handleMultipartUpload(videoFile, UploadType.VIDEO);
        videoSuccess = result.success;
        videoLocationUrl = result.key;
      }
      setUploadProgress(80);

      const splatEditMetaData: SplatEditMetaData = {
        id: splatPayload.get("id") as unknown as number,
        name: splatPayload.get("name") as string,
        description: splatPayload.get("description") as string,
        splatFileUrl: splatLocationUrl,
        videoFileUrl: videoLocationUrl,
      };
      if (
        (splatFile.size > 0 && !splatSuccess) ||
        (videoFile.size > 0 && !videoSuccess)
      ) {
        throw new Error("File upload failed");
      }

      const response = await fetch("/api/admin/editSplatById", {
        method: "POST",
        body: JSON.stringify(splatEditMetaData),
      });
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload["error"]);
      }
      setUploadProgress(100);
      return response.ok;
    } catch (error) {
      console.error("Error editing splat:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleURLSubmit = async (formEvent: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    try {
      formEvent.preventDefault();

      const formData = new FormData(formEvent.currentTarget);
      const splatName = formData.get("name");

      if (!splatName || splatName.toString().trim().length == 0) {
        throw new Error("Splat Name not provided.");
      }

      formData.append("id", splatData.id.toString());

      const result = await handleEditSplat(formData);
      if (result) {
        setEdited(true);
        onSuccess();
      }
    } catch (error) {
      console.error(`Edit Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <LoadSpinner progress={uploadProgress} />;
  } else {
    if (isEdited) {
      return (
        <>
          <div className="p-8 flex flex-col items-center justify-center">
            <h3 className="text-base font-semibold text-teal-500">
              Changes have been saved!
            </h3>
          </div>
        </>
      );
    } else {
      return (
        <SplatForm
          submitBtnLabel="Save Changes"
          onSubmitCallback={handleURLSubmit}
          initialData={splatData}
        />
      );
    }
  }
}
