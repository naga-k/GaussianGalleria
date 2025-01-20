import { FormEvent } from "react";

interface SplatUploadFormProps {
  onSubmitCallback: (formevent: FormEvent<HTMLFormElement>) => void;
  submitBtnLabel: string;
  initialData?: {
    name: string;
    description?: string;
  };
}

export default function SplatUploadForm({
  onSubmitCallback,
  submitBtnLabel,
  initialData,
}: SplatUploadFormProps) {
  return (
    <>
      <form
        className="flex flex-col items-start justify-start py-4"
        onSubmit={onSubmitCallback}
      >
        <input
          className="w-full my-2 px-4 py-2 bg-inherit border border-slate-400 rounded"
          type="text"
          name="name"
          defaultValue={initialData ? initialData.name : undefined}
          required
          placeholder="Name"
        />

        <input
          className="w-full my-2 px-4 py-2 bg-inherit border border-slate-400 rounded"
          type="textarea"
          name="description"
          defaultValue={initialData?.description}
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
          required={initialData ? false : true}
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
          required={initialData ? false : true}
        />
        <div className="flex w-full mt-4 px-4 justify-center">
          <button type="submit" className="default-button">
            {submitBtnLabel}
          </button>
        </div>
      </form>
    </>
  );
}
