import LoadSpinner from "@/src/app/components/LoadSpinner";
import { GalleryMeta } from "@/src/app/lib/definitions/GalleryItem";
import { useState } from "react";
import GalleryForm from "../components/GalleryForm";

interface EditGalleryProps {
  initialData: GalleryMeta;
  onSuccess: () => void;
}

export default function EditGalleryModal({
  initialData,
  onSuccess,
}: EditGalleryProps) {
  const [isLoading, setLoading] = useState(false);
  const [isEdited, setEdited] = useState(false);

  const handleFormSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/galleries/${initialData.id}/edit`,
        { method: "POST", body: formData }
      );

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error);
      }

      setEdited(true);
      onSuccess();
    } catch (error) {
      console.log(`Edit Gallery Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <LoadSpinner />;
  } else if (isEdited) {
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
      <>
        <GalleryForm initialData={initialData} onSubmit={handleFormSubmit} />
      </>
    );
  }
}
