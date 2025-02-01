import LoadSpinner from "@/src/app/components/LoadSpinner";
import { useState } from "react";
import GalleryForm from "../components/GalleryForm";

export default function CreateGalleryModal({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [isLoading, setLoading] = useState(false);
  const [isCreated, setCreated] = useState(false);

  const handleFormSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/galleries/create", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error);
      }
      setCreated(true);
      onSuccess();
    } catch (error) {
      console.log(`Create Gallery Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <LoadSpinner />;
  } else if (isCreated) {
    return (
      <>
        <div className="p-8 flex flex-col items-center justify-center">
          <h3 className="text-base font-semibold text-teal-500">
            Gallery has been created!
          </h3>
        </div>
      </>
    );
  } else {
    return (
      <>
        <GalleryForm onSubmit={handleFormSubmit} />
      </>
    );
  }
}
