// src/app/admin/dashboard/galleries/page.tsx
"use client";

import { useRouter } from "next/navigation";
import DashHeader from "../../components/DashHeader";
import AuthContainer from "../../../components/AuthContainer";
import GalleryManager from "./GalleryManager";

export default function DashBoard() {
  const router = useRouter();
  return (
    <AuthContainer
      fallback={() => {
        router.push("/admin");
      }}
    >
      <DashHeader />
      <GalleryManager />
    </AuthContainer>
  );
}
