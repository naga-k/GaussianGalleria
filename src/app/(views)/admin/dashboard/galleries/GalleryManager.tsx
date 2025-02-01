import LoadSpinner from "@/src/app/components/LoadSpinner";
import { ReactNode, useEffect, useState } from "react";
import TableViewer from "../components/TableViewer";
import ModalContainer from "@/src/app/components/ModalContainer";
import {
  GalleryItem,
  GalleryMeta,
  GallerySplat,
} from "@/src/app/lib/definitions/GalleryItem";
import TableRowActions from "../components/TableRowActions";
import DeleteGalleryModal from "./modalViews/DeleteGalleryModal";
import CreateGalleryModal from "./modalViews/CreateGalleryModal";
import EditGalleryModal from "./modalViews/EditGalleryModal";

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

  const editButtonCallback = async (id: number) => {
    try {
      const metaResponse = await fetch(
        `/api/galleries/gallery/${id}/fetchDetails`
      );

      if (!metaResponse.ok) {
        const payload = await metaResponse.json();
        throw new Error(payload["error"]);
      }

      const gallery: GalleryItem = await metaResponse.json();

      const payload: GalleryMeta = {
        id: gallery.id,
        name: gallery.name,
        description: gallery.description || undefined,
        splatIds: [],
      };

      const splatResponse = await fetch(`/api/galleries/gallery/${id}/splats`);
      if (!splatResponse.ok) {
        const payload = await metaResponse.json();
        throw new Error(payload["error"]);
      }

      const meta: GallerySplat[] = await splatResponse.json();

      payload.splatIds = meta.map((data) => data.id);

      setModalData({ title: "Edit Gallery", data: payload });
      setMode(2);
      setOpened(true);
    } catch (error) {
      console.log(`Error occurred during edit start: ${error}`);
    }
  };

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
  }, [isStale]);

  const onModalClose = () => {
    setMode(0);
    setOpened(false);
  };

  const onCreateClick = () => {
    setModalData({
      title: "Create Gallery",
      data: { id: -1, name: "", splatIds: [] },
    });
    setMode(1);
    setOpened(true);
  };

  const handleModalSuccess = () => {
    setStale(true);
  };

  return (
    <div className="w-full flex flex-col justify-center">
      <div className="min-w-screen flex flex-column mx-4 px-4 py-2 items-center justify-end">
        <button onClick={onCreateClick} className="default-button">
          + Create
        </button>
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
            1: <CreateGalleryModal onSuccess={handleModalSuccess} />,
            2: (
              <EditGalleryModal
                initialData={modalData.data}
                onSuccess={handleModalSuccess}
              />
            ),
            3: (
              <DeleteGalleryModal
                id={modalData.data.id}
                onSuccess={handleModalSuccess}
              />
            ),
          }[mode]
        }
      </ModalContainer>
    </div>
  );
}
