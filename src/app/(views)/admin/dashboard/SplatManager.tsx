import React, { useState, useEffect, ReactNode } from "react";
import TableViewer from "@/src/app/(views)/admin/dashboard/components/TableViewer";
import VideoItem from "@/src/app/lib/definitions/VideoItem";
import LoadSpinner from "@/src/app/components/LoadSpinner";
import TableRowActions from "@/src/app/(views)/admin/dashboard/components/TableRowActions";
import UploadSplatModal from "@/src/app/(views)/admin/dashboard/modalViews/UploadSplatModal";
import ModalContainer from "@/src/app/components/ModalContainer";
import EditSplatModal from "@/src/app/(views)/admin/dashboard/modalViews/EditSplatModal";
import DeleteSplatModal from "@/src/app/(views)/admin/dashboard/modalViews/DeleteSplatModal";

type SplatItem = {
  id: number;
  name: string;
  actions: ReactNode;
};

type SplatMeta = {
  id: number;
  name: string;
  description?: string;
};

type ModalData = {
  title: string | null;
  data: SplatMeta;
};

const initialModalState: ModalData = {
  title: null,
  data: {
    id: -1,
    name: "",
  },
};

export default function SplatManager() {
  const [isLoading, setLoading] = useState(true);
  const [isOpened, setOpened] = useState(false);
  const [isStale, setStale] = useState(true);
  const [mode, setMode] = useState(0);
  const [modalData, setModalData] = useState<ModalData>(initialModalState);
  const [splats, setSplats] = useState<SplatItem[]>([]);

  const onModalClose = () => {
    setModalData(initialModalState);
    setMode(0);
    setOpened(false);
  };

  const onUploadClick = () => {
    setModalData({ title: "Upload Splat", data: initialModalState.data });
    setMode(1);
    setOpened(true);
  };

  const editButtonCallback = async (id: number) => {
    try {
      const response = await fetch(
        `/api/fetchSceneDetailsWithID?${new URLSearchParams({
          id: id.toString(),
        }).toString()}`
      );
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload["error"]);
      }

      const splatMeta: SplatMeta = {
        id: payload.id || undefined,
        name: payload.name || undefined,
        description: payload.description || undefined,
      };

      setModalData({ title: "Edit Splat", data: splatMeta });
      setMode(2);
      setOpened(true);
    } catch (error) {
      console.log(`Edit error occurred: ${error}`);
    }
  };

  const deleteButtonCallback = async (id: number) => {
    setModalData({ title: "Delete Splat", data: { id: id, name: "" } });
    setMode(3);
    setOpened(true);
  };

  useEffect(() => {
    if (isStale) {
      setLoading(true);
      fetch("/api/fetchVideoItems")
        .then((res) => res.json())
        .then((data: VideoItem[]) => {
          setSplats(
            data.map((videoItem: VideoItem) => {
              return {
                id: videoItem.id,
                name: videoItem.name,
                actions: (
                  <TableRowActions
                    id={videoItem.id}
                    type="splat"
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

  const handleModalSuccess = () => {
    setStale(true);
  };

  return (
    <>
      <div className="min-w-screen flex flex-column px-4 items-center justify-end">
        <div className="w-fit h-fit">
          <button onClick={onUploadClick} className="default-button">
            + Upload
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadSpinner />
      ) : (
        <TableViewer headers={["ID", "Name", "Actions"]} values={splats} />
      )}

      <ModalContainer
        title={modalData.title}
        isOpened={isOpened}
        onClose={onModalClose}
      >
        {
          {
            1: <UploadSplatModal onSuccess={handleModalSuccess} />,
            2: (
              <EditSplatModal
                splatData={modalData.data}
                onSuccess={handleModalSuccess}
              />
            ),
            3: (
              <DeleteSplatModal
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
