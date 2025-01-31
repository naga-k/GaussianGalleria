import LoadSpinner from "@/src/app/components/LoadSpinner";
import { ReactNode, useEffect, useState } from "react";
import TableViewer from "../../components/TableViewer";
import ModalContainer from "@/src/app/components/ModalContainer";
import {
  GalleryItem,
  GallerySplat,
} from "@/src/app/lib/definitions/GalleryItem";
import TableRowActions from "../../components/TableRowActions";
import DeleteGalleryModal from "./modalViews/DeleteGalleryModal";

type GalleryMeta = {
  id: number;
  name: string;
  description?: string;
  splatIds: number[];
};

type GalleryTableItem = {
  id: number;
  name: string;
  actions: ReactNode;
};

type ModalData = {
  data: GalleryMeta;
  title: string | null;
};

const initialModalState: ModalData = {
  title: null,
  data: {
    id: -1,
    name: "",
    splatIds: [],
  },
};

export default function GalleryManager() {
  const [isLoading, setLoading] = useState(true);
  const [isOpened, setOpened] = useState(false);
  const [mode, setMode] = useState(0);
  const [isStale, setStale] = useState(true);
  const [galleries, setGalleries] = useState<GalleryTableItem[]>([]);
  const [modalData, setModalData] = useState(initialModalState);

  const deleteButtonCallback = (id: number) => {
    setModalData({
      title: "Delete Gallery",
      data: { id: id, name: "", splatIds: [] },
    });
    setMode(3);
    setOpened(true);
  };

  useEffect(() => {
    if (isStale) {
      const editButtonCallback = async (id: number) => {
        try {
          const gallery = galleries.find((gallery) => gallery.id === id);

          if (gallery === undefined) {
            throw new Error(
              "Unable to fetch gallery information from local state."
            );
          }

          const payload: GalleryMeta = {
            id: gallery.id,
            name: gallery.name,
            splatIds: [],
          };

          const metaResponse = await fetch(
            `/api/galleries/gallery/${id}/splats`
          );
          if (!metaResponse.ok) {
            throw new Error(`HTTP error! status: ${metaResponse.status}`);
          }
          const meta: GallerySplat[] = await metaResponse.json();

          payload.splatIds.concat(meta.map((data) => data.id));

          setModalData({ title: "Edit Gallery", data: payload });
          setMode(2);
          setOpened(true);
        } catch (error) {
          console.log(`Error occurred during edit start: ${error}`);
        }
      };

      setLoading(true);
      fetch("/api/galleries/fetchGalleries")
        .then((res) => res.json())
        .then((data: GalleryItem[]) => {
          setGalleries(
            data.map((gallery: GalleryItem) => {
              return {
                id: gallery.id,
                name: gallery.name,
                actions: (
                  <TableRowActions
                    id={gallery.id}
                    type="gallery"
                    editCallback={editButtonCallback}
                    deleteCallback={deleteButtonCallback}
                  />
                ),
              };
            })
          );
        })
        .catch((err) => console.error(err))
        .finally(() => {
          setStale(false);
          setLoading(false);
        });
    }
  }, [isStale, galleries]);

  const onCreateClick = () => {
    setMode(1);
    setOpened(true);
  };

  const onModalClose = () => {
    setMode(0);
    setOpened(false);
  };

  const handleModalSuccess = () => {
    setStale(true);
  };

  return (
    <>
      <div className="min-w-screen flex flex-column px-4 items-center justify-end">
        <div className="w-fit h-fit">
          <button onClick={onCreateClick} className="default-button">
            + Create
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadSpinner />
      ) : (
        <TableViewer headers={["ID", "Name", "Actions"]} values={galleries} />
      )}

      <ModalContainer
        title={modalData.title}
        isOpened={isOpened}
        onClose={onModalClose}
      >
        {
          {
            3: (
              <DeleteGalleryModal
                id={modalData.data.id}
                onSuccess={handleModalSuccess}
              />
            ),
          }[mode]
        }
      </ModalContainer>
    </>
  );
}
