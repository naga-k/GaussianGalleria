import LoadSpinner from "@/src/app/components/LoadSpinner";
import { FormEvent, useState } from "react";
import SplatForm from "./components/SplatForm";

export default function UploadSplatModal() {
  const [isLoading, setLoading] = useState(false);
  const [isUploaded, setUploaded] = useState(false);

  const handleUploadSplat = async (splatPayload: FormData) => {
    const response = await fetch("/api/admin/uploadSplat", {
      method: "POST",
      body: splatPayload,
    });
    if (!response.ok) {
      const payload = await response.json();
      throw new Error(payload["error"]);
    }
    return response.ok;
  };

  const handleURLSubmit = async (formEvent: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    try {
      formEvent.preventDefault();

      const formData = new FormData(formEvent.currentTarget);

      if (
        !formData.get("name") ||
        formData.get("name")?.toString().length == 0
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
