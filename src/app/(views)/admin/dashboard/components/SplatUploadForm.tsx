import LoadSpinner from "@/src/app/components/LoadSpinner";
import { FormEvent, useState } from "react";

interface SplatUploadFormProps {
  onUploadCallback: () => void;
}

export default function SplatUploadForm({
  onUploadCallback,
}: SplatUploadFormProps) {
  const [isLoading, setLoading] = useState(false);
  const [isUploaded, setUploaded] = useState(false);
  const handleUploadSplat = async (splatPayload: FormData) => {
    const response = await fetch("/api/admin/uploadSplat", {
      method: "POST",
      body: splatPayload,
    });
    if (!response.ok) {
      const payload = await response.json();
      console.log(payload["error"]);
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
      } else {
        console.error("Splat upload unsuccessful.");
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
            <button onClick={onUploadCallback} className="default-button mt-4">
              Close
            </button>
          </div>
        </>
      );
    }
    return (
      <>
        <form
          className="flex flex-col items-start justify-start py-4"
          onSubmit={handleURLSubmit}
        >
          <input
            className="w-full my-2 px-4 py-2 bg-inherit border border-slate-400 rounded"
            type="text"
            name="name"
            required
            placeholder="Name"
          />

          <input
            className="w-full my-2 px-4 py-2 bg-inherit border border-slate-400 rounded"
            type="textarea"
            name="description"
            placeholder="Describe your Splat"
          />

          <label htmlFor="splatFile" className="mt-2 text-teal-400">
            Choose Splat File
          </label>
          <input
            className="w-fit my-2 py-2"
            type="file"
            id="splatFile"
            name="splatFile"
            accept=".splat,.ply"
            required
          />

          <label htmlFor="videoFile" className="mt-2 text-teal-400">
            Choose Video File
          </label>
          <input
            className="w-fit my-2 py-2"
            type="file"
            id="videoFile"
            name="videoFile"
            accept="video/*"
            required
          />
          <div className="flex w-full mt-4 px-4 justify-center">
            <button type="submit" className="default-button">
              Upload to S3
            </button>
          </div>
        </form>
      </>
    );
  }
}
