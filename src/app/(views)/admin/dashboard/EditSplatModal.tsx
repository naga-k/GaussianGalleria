import LoadSpinner from "@/src/app/components/LoadSpinner";
import { FormEvent, useState } from "react";
import SplatForm from "./components/SplatForm";

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

  const handleEditSplat = async (splatPayload: FormData) => {
    const response = await fetch("/api/admin/editSplatById", {
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
      const splatName = formData.get("name");

      if (!splatName || splatName.toString().trim().length == 0) {
        throw new Error("Splat Name not provided.");
      }

      formData.append("id", splatData.id.toString());

      const result = await handleEditSplat(formData);
      if (result) {
        setEdited(true);
        onSuccess();
        console.log("Splat Edit successful!");
      }
    } catch (error) {
      console.error(`Edit Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <LoadSpinner />;
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
