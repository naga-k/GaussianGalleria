import LoadSpinner from "@/src/app/components/LoadSpinner";
import VideoItem from "@/src/app/lib/definitions/VideoItem";
import { ChangeEvent, FormEvent, SyntheticEvent, useState } from "react";

type SplatDetails = {
  id: number;
  name: string;
};

interface GalleryFormProps {
  onSubmit: (formData: FormData) => void;
  initialData?: {
    id: number;
    name: string;
    description?: string;
    splatIds: number[];
  };
}

export default function GalleryForm({
  onSubmit,
  initialData,
}: GalleryFormProps) {
  const [isLoading, setLoading] = useState(false);
  const [galleryFormData, setGalleryFormData] = useState<FormData>();
  const [splatDetails, setSplatDetails] = useState<SplatDetails[]>([]);
  const [stepCount, setStepCount] = useState(0);

  const onStepOneSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      setGalleryFormData(formData);

      const response = await fetch("/api/fetchVideoItems");
      if (!response.ok) {
        throw new Error("Unable to fetch Splat list");
      }

      const splatList: SplatDetails[] = await response
        .json()
        .then((payload: VideoItem[]) => {
          return payload.map((item: VideoItem) => {
            return {
              id: item.id,
              name: item.name,
            };
          });
        });

      setSplatDetails(splatList);
      setStepCount(stepCount + 1);
    } catch (error) {
      console.log(`Gallery Form Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const onStepTwoSubmit = (formData: FormData) => {
    try {
      const newGalleryFormData = galleryFormData;
      if (newGalleryFormData === undefined) {
        throw new Error("Form Data not defined during Step One.");
      }

      const newSplatIds = formData.get("splatIds");
      if (newSplatIds === null) {
        throw new Error("Unable to get new selected Splat IDs.");
      }

      newGalleryFormData.append("splatIds", newSplatIds);
      onSubmit(newGalleryFormData);
    } catch (error) {
      console.log(`Gallery Form Error: ${error}`);
    }
  };

  const renderFormStep = (stepIndex: number) => {
    const formSteps: { [index: number]: JSX.Element } = {
      0: (
        <StepOneForm
          key={0}
          onStepSubmit={onStepOneSubmit}
          initialData={initialData}
        />
      ),
      1: (
        <StepTwoForm
          key={1}
          onStepSubmit={onStepTwoSubmit}
          splatDetails={splatDetails}
        />
      ),
    };

    return formSteps[stepIndex];
  };

  if (isLoading) {
    return <LoadSpinner />;
  } else {
    return <>{renderFormStep(stepCount)}</>;
  }
}

interface StepProps {
  onStepSubmit: (formData: FormData) => void;
  initialData?: {
    id: number;
    name: string;
    description?: string;
    splatIds: number[];
  };
}

function StepOneForm({ onStepSubmit, initialData }: StepProps) {
  const handleFormSubmit = (formEvent: FormEvent<HTMLFormElement>) => {
    try {
      formEvent.preventDefault();

      const formData = new FormData(formEvent.currentTarget);

      if (
        !formData.get("name") ||
        formData.get("name")?.toString().trim().length == 0
      ) {
        throw new Error("Splat Name not provided.");
      }

      onStepSubmit(formData);
    } catch (error) {
      throw error;
    }
  };

  return (
    <form
      className="p-8 w-full flex flex-col items-start justify-start"
      onSubmit={handleFormSubmit}
    >
      <label htmlFor="name" className="mt-2 text-teal-400">
        Name
      </label>
      <input
        className="w-full my-2 px-4 py-2 bg-inherit border border-slate-400 rounded"
        type="text"
        name="name"
        defaultValue={initialData ? initialData.name : undefined}
        required
        placeholder="Enter Name..."
      />

      <label htmlFor="description" className="mt-2 text-teal-400">
        Description
      </label>
      <input
        className="w-full my-2 px-4 py-2 bg-inherit border border-slate-400 rounded"
        type="textarea"
        name="description"
        defaultValue={initialData?.description}
        placeholder="Describe your Gallery..."
      />

      <label htmlFor="thumbnail" className="mt-2 text-teal-400">
        Choose Thumbnail Image
      </label>
      <input
        className="w-fit my-2 py-2"
        type="file"
        id="thumbnail"
        name="thumbnail"
        accept="image/*"
      />
      <div className="w-full flex mt-4 justify-end">
        <button type="submit" className="default-button">
          Next
        </button>
      </div>
    </form>
  );
}

interface StepTwoProps {
  onStepSubmit: (formData: FormData) => void;
  splatDetails: SplatDetails[];
  initialData?: {
    id: number;
    name: string;
    description?: string;
    splatIds: number[];
  };
}

function StepTwoForm({
  onStepSubmit,
  splatDetails,
  initialData,
}: StepTwoProps) {
  const [selectedSplatIds, setSelectedSplatIds] = useState<number[]>(
    initialData ? initialData.splatIds : []
  );

  const [searchResults, setSearchResults] =
    useState<SplatDetails[]>(splatDetails);

  const searchSplat = (event: ChangeEvent<HTMLInputElement>) => {
    const searchTerm: string = event.target.value;

    if (searchTerm.length === 0) {
      setSearchResults(splatDetails);
    } else {
      const results = splatDetails.filter((splat) =>
        splat.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
      );
      setSearchResults(results);
    }
  };

  const handleOptionSelect = (id: number) => {
    if (!selectedSplatIds.includes(id)) {
      setSelectedSplatIds([...selectedSplatIds, id]);
    } else {
      setSelectedSplatIds(selectedSplatIds.filter((splatId) => splatId !== id));
    }
  };

  const handleConfirmation = () => {
    const formData = new FormData();
    formData.append("splatIds", JSON.stringify(selectedSplatIds));
    onStepSubmit(formData);
  };

  return (
    <div className="w-full flex flex-col p-8 items-start justify-start">
      <input
        className="w-full my-2 px-4 py-2 bg-inherit border border-slate-400 rounded"
        type="text"
        placeholder="Search Splats..."
        onChange={searchSplat}
      />
      <div>
        <ul className="w-full h-[50svh] my-2 px-2 overflow-y-auto bg-inherit border border-slate-400 rounded">
          {searchResults.length > 0 ? (
            searchResults.map((splat: SplatDetails) => {
              return (
                <li
                  className={`min-w-full p-2 rounded cursor-pointer text-wrap hover:border ${
                    selectedSplatIds.includes(splat.id)
                      ? "bg-foreground text-background"
                      : ""
                  }`}
                  key={splat.id}
                  onClick={(event) => handleOptionSelect(splat.id)}
                  value={splat.id}
                >
                  {splat.name}
                </li>
              );
            })
          ) : (
            <li className="min-w-full p-2 my-2 rounded cursor-pointer text-wrap">
              <p>No results</p>
            </li>
          )}
        </ul>
      </div>
      <div className="w-full flex mt-4 justify-end">
        <button onClick={handleConfirmation} className="default-button">
          Confirm
        </button>
      </div>
    </div>
  );
}
