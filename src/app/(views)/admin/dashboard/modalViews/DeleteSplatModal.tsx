import LoadSpinner from "@/src/app/components/LoadSpinner";
import { useState } from "react";
import DeleteForm from "../components/DeleteForm";

interface DeleteSplatProps {
  id: number;
  onSuccess: () => void;
}

export default function DeleteSplatModal({ id, onSuccess }: DeleteSplatProps) {
  const [isLoading, setLoading] = useState(false);
  const [isDeleted, setDeleted] = useState(false);

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

  const handleConfirmation = async () => {
    setLoading(true);
    try {
      const result = await handleDelete(id);
      if (result) {
        setDeleted(true);
        onSuccess();
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
    return <DeleteForm onConfirm={handleConfirmation} />;
  }
}
