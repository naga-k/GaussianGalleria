// src/app/admin/dahsboard/page.tsx
"use client";

import { useRouter } from "next/navigation";
import AuthContainer from "../components/AuthContainer";
import React, { useState, useEffect, ReactNode } from "react";
import TableViewer from "./components/TableViewer";
import VideoItem from "@/src/app/lib/definitions/VideoItem";
import LoadSpinner from "@/src/app/components/LoadSpinner";
import SplatRowActions from "./components/SplatRowActions";
import UploadSplatModal from "./UploadSplatModal";
import ModalContainer from "@/src/app/components/ModalContainer";
import EditSplatModal from "./EditSplatModal";

type SplatItem = {
  id: number;
  name: string;
  actions: ReactNode;
};

type SplatEditMeta = {
  id: number;
  name: string;
  description?: string;
};

export default function DashBoard() {
  const router = useRouter();
  return (
    <AuthContainer
      fallback={() => {
        router.push("/admin");
      }}
    >
      <DashboardContainer />
    </AuthContainer>
  );
}

function DashboardContainer() {
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const [isOpened, setOpened] = useState(false);
  const [mode, setMode] = useState(0);
  const [splatEditMeta, setSplatEditMeta] = useState<SplatEditMeta[]>([]);
  const [splats, setSplats] = useState<SplatItem[]>([]);

  const onModalClose = () => {
    setOpened(false);
  };

  const handleLogout = async () => {
    fetch("/api/admin/logout", { method: "POST" })
      .then(() => {
        router.push("/admin");
      })
      .catch((error) => {
        console.error(error);
      });
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

      const splatMeta: SplatEditMeta = {
        id: payload.id || undefined,
        name: payload.name || undefined,
        description: payload.description || undefined,
      };

      setSplatEditMeta([splatMeta]);

      setMode(2);
      setOpened(true);
    } catch (error) {
      console.log(`Edit error occurred: ${error}`);
    }
  };

  useEffect(() => {
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
                <SplatRowActions
                  id={videoItem.id}
                  editCallback={editButtonCallback}
                />
              ),
            };
          })
        );
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <header className="min-w-screen p-4 flex flex-row justify-between items-center">
        <div className="mx-2 p-2 font-bold text-lg hover:text-teal-400">
          <p>GaussianGallery Dashboard</p>
        </div>

        <ul className="flex flex-row justify-between list-none">
          <li className="mx-2 p-2 cursor-pointer hover:text-teal-400">
            <a
              onClick={() => {
                router.push("/");
              }}
            >
              Galleries
            </a>
          </li>
          <li className="mx-2 p-2 cursor-pointer hover:text-teal-400">
            <a
              onClick={() => {
                router.push("/");
              }}
            >
              Manage Galleries
            </a>
          </li>
          <li className="mx-2 p-2 cursor-pointer hover:text-red-400">
            <a onClick={handleLogout}>Log Out</a>
          </li>
        </ul>
      </header>

      <div className="min-w-screen flex flex-column px-4 items-center justify-end">
        <div className="w-fit h-fit">
          <button
            onClick={() => {
              setOpened(true);
            }}
            className="default-button"
          >
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
        title="Upload Splat"
        isOpened={isOpened}
        onClose={onModalClose}
      >
        {
          {
            1: <UploadSplatModal />,
            2: <EditSplatModal splatData={splatEditMeta[0]} />,
          }[mode]
        }
      </ModalContainer>
    </>
  );
}
