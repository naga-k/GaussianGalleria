// app/admin/dahsboard/page.tsx
"use client";

import { useRouter } from "next/navigation";
import AuthContainer from "../components/AuthContainer";
import ModalContainer from "@/src/app/components/ModalContainer";
import SplatUploadForm from "./components/SplatUploadForm";
import React, { useState, useEffect } from "react";
import TableViewer from "./components/TableViewer";
import VideoItem from "@/src/app/lib/definitions/VideoItem";
import LoadSpinner from "@/src/app/components/LoadSpinner";

type SplatItem = {
  id: number;
  name: string;
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
  const [isOpened, setOpened] = useState(false);
  const [isLoading, setLoading] = useState(true);
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

  useEffect(() => {
    setLoading(true);
    fetch("/api/fetchVideoItems")
      .then((res) => res.json())
      .then((data: VideoItem[]) => {
        setSplats(
          data.map((videoItem: VideoItem) => {
            return { id: videoItem.id, name: videoItem.name };
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
        <TableViewer headers={["ID", "Name"]} values={splats} />
      )}

      <ModalContainer title="Upload Splat" isOpened={isOpened} onClose={onModalClose}>
        <SplatUploadForm onUploadCallback={onModalClose} />
      </ModalContainer>
    </>
  );
}
