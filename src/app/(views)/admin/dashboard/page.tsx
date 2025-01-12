// app/admin/dahsboard/page.tsx
"use client";

import { useRouter } from "next/navigation";
import AuthContainer from "../components/AuthContainer";
import ModalContainer from "@/src/app/components/ModalContainer";
import SplatUploadForm from "./components/SplatUploadForm";
import React, { useState, useEffect } from "react";

interface SplatItem {
  id: number;
  name: string;
  // src: string;
  // splatUrl: string;
}

export default function DashBoard() {
  const router = useRouter();
  return (
    <AuthContainer fallback={() => {router.push("/admin");}}>
      <DashboardContainer />
    </AuthContainer>
  );
}

function DashboardContainer() {
  const router = useRouter();
  const [isOpened, setOpened] = useState(false);
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
    fetch("/api/fetchVideoItems")
      .then((res) => res.json())
      .then((data) => setSplats(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <header className="w-screen p-4 flex flex-row justify-between items-center">
        <div className="mx-2 p-2 font-bold text-lg hover:text-teal-400">
          <p>DiffStudio Dashboard</p>
        </div>

        <ul className="flex flex-row justify-between list-none">
          <li className="mx-2 p-2 cursor-pointer hover:text-teal-400">
            <a onClick={() => {router.push("/");}}>Gallery</a>
          </li>
          <li className="mx-2 p-2 cursor-pointer hover:text-red-400">
            <a onClick={handleLogout}>Log Out</a>
          </li>
        </ul>
      </header>

      <div className="w-screen flex flex-column items-center justify-end">
        <button
          onClick={() => {setOpened(true);}}
          className="w-fit h-fit m-8 px-4 py-2 bg-teal-800 hover:bg-teal-600 font-bold rounded"
        >
          + Upload
        </button>
      </div>

      <SplatList splats={splats} />

      <ModalContainer isOpened={isOpened} onClose={onModalClose}>
        <SplatUploadForm onUploadCallback={onModalClose} />
      </ModalContainer>
    </>
  );
}

function SplatList({ splats }: { splats: SplatItem[] }) {
  return (
    <div className="px-8">
      <table className="w-full mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>

            
          </tr>
        </thead>
        <tbody>
          {splats.map(({ id, name }) => (
            <tr key={id} className="border-b">
              <td className="p-2">{id}</td>
              <td className="p-2">{name}</td>
              
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
