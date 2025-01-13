// import SplatUploadPayload from "@/src/app/lib/definitions/SplatUploadPayload";
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
            <button
              onClick={onUploadCallback}
              className="w-fit h-fit m-8 px-4 py-2 bg-teal-800 hover:bg-teal-600 font-bold rounded"
            >
              Close
            </button>
          </div>
        </>
      );
    }
    return (
      <>
        <form
          className="flex flex-col items-center justify-center"
          onSubmit={handleURLSubmit}
        >
          <h3 className="text-base font-semibold text-teal-500">
            Upload Splat
          </h3>

          <input
            className="w-auto m-4 px-4 py-2 bg-inherit border-2 rounded text-white"
            type="text"
            name="name"
            required
            placeholder="Name"
          />

          <input
            className="w-auto m-4 px-4 py-2 bg-inherit border-2 rounded text-white"
            type="textarea"
            name="description"
            placeholder="Describe your Splat"
          />

          <label htmlFor="splatFile" className="text-teal-400">Choose Splat File: </label>
          <input
            className="w-auto m-4 px-4 py-2 bg-inherit border-2 rounded text-white"
            type="file"
            id="splatFile"
            name="splatFile"
            accept=".splat,.ply"
            required
          />

          <label htmlFor="videoFile" className="text-teal-400">Choose Video File: </label>
          <input
            className="w-auto m-4 px-4 py-2 bg-inherit border-2 rounded text-white"
            type="file"
            id="videoFile"
            name="videoFile"
            accept="video/*"
            required
          />

          <button
            type="submit"
            className="w-fit h-fit m-8 px-4 py-2 bg-teal-800 hover:bg-teal-600 font-bold rounded"
          >
            Upload to S3
          </button>
        </form>
      </>
    );
  }
}
