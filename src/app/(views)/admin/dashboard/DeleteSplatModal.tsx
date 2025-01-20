import LoadSpinner from "@/src/app/components/LoadSpinner";
import { FormEvent, useState } from "react";

interface DeleteSplatProps {
  id: number;
}

export default function DeleteSplatModal({ id }: DeleteSplatProps) {
  const [isLoading, setLoading] = useState(false);
  const [isDeleted, setDeleted] = useState(false);
  const [isWrongText, setIsWrongText] = useState(false);

  const handleDelete = async (id: number) => {
    const response = await fetch("/api/admin/deleteSplatById", {
      method: "POST",
      body: JSON.stringify({
        id: id,
      }),
    });
    if (!response.ok) {
      const payload = await response.json();
      throw new Error(payload["error"]);
    }
    return response.ok;
  };

  const handleConfirmation = async (formEvent: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    try {
      formEvent.preventDefault();
      const formData = new FormData(formEvent.currentTarget);
      const confirmText = formData.get("confirmText")?.toString() || null;

      if (confirmText && confirmText !== "permanently delete") {
        setIsWrongText(true);
        formEvent.currentTarget.reset();
      } else {
        console.log(id);
        const result = await handleDelete(id);
        if (result) {
          setDeleted(true);
        }
      }
    } catch (error) {
      console.error(`Delete Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <LoadSpinner />;
  } else if (isDeleted) {
    return (
      <>
        <div className="p-8 flex flex-col items-center justify-center">
          <h3 className="text-base font-semibold text-teal-500">
            Splat has been deleted!
          </h3>
        </div>
      </>
    );
  } else {
    return (
      <div className="p-8 flex flex-col items-start justify-start">
        <div>
          <h4 className="text-semibold">
            Are you sure you want to delete this splat?
          </h4>
          <p className="text-gray-400">
            Type <i className="text-semibold">permanently delete</i> in the
            field below and confirm.
          </p>
          {isWrongText && (
            <p className="text-bold text-red-600">
              Please check your spelling and try again.
            </p>
          )}
        </div>
        <form className="w-full" onSubmit={handleConfirmation}>
          <input
            className="w-full my-4 px-4 py-2 bg-inherit border border-slate-400 rounded"
            name="confirmText"
            type="text"
            onInput={() => setIsWrongText(false)}
            placeholder="permanently delete"
            required
          />
          <div className="flex mt-4 justify-end">
            <button
              className="default-button bg-red-500 hover:bg-red-600"
              type="submit"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    );
  }
}
