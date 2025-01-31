import { FormEvent, useState } from "react";

interface DeleteFormProps {
  onConfirm: () => void;
}

export default function DeleteForm({ onConfirm }: DeleteFormProps) {
  const [isWrongText, setIsWrongText] = useState(false);

  const handleConfirmation = async (formEvent: FormEvent<HTMLFormElement>) => {
    try {
      formEvent.preventDefault();
      const formData = new FormData(formEvent.currentTarget);
      const confirmText = formData.get("confirmText")?.toString() || null;

      if (confirmText && confirmText !== "permanently delete") {
        setIsWrongText(true);
        formEvent.currentTarget.reset();
      } else {
        onConfirm();
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="p-8 flex flex-col items-start justify-start">
      <div>
        <div className="mb-4 w-full flex justify-center">
          <h3 className="text-lg font-bold">Are you sure?</h3>
        </div>

        <p className="text-gray-400">
          Type <i className="font-semibold">permanently delete</i> in the field
          below and confirm.
        </p>
        {isWrongText && (
          <p className="font-bold text-red-600">
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
          autoComplete="off"
          onCut={(event) => {
            event.preventDefault();
          }}
          onCopy={(event) => {
            event.preventDefault();
          }}
          onPaste={(event) => {
            event.preventDefault();
          }}
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
