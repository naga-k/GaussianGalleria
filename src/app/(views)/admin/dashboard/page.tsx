// src/app/admin/dashboard/page.tsx
"use client";

import { useRouter } from "next/navigation";
import DashHeader from "./components/DashHeader";
import AuthContainer from "../components/AuthContainer";
import SplatManager from "./SplatManager";

export default function DashBoard() {
  const router = useRouter();
  return (
    <AuthContainer
      fallback={() => {
        router.push("/admin");
      }}
    >
      <DashHeader />
      <SplatManager />
    </AuthContainer>
  );
}
