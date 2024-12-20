// app/admin/dahsboard/page.tsx
"use client";

import { useRouter } from "next/navigation";
import AuthContainer from "../components/AuthContainer";

export default function DashBoard() {
  return (
    <AuthContainer>
      <DashboardContainer />
    </AuthContainer>
  );
}

function DashboardContainer() {
  const router = useRouter();

  const handleLogout = async () => {
    fetch("/api/admin/logout", { method: "POST" })
      .then(() => {
        router.push("/admin");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <div className="w-screen p-4 flex flex-row justify-between items-center">
        <div className="mx-2 p-2 font-bold text-lg hover:text-teal-400">
          <p>Admin Dashboard</p>
        </div>

        <ul className="flex flex-row justify-between list-none">
          <li className="mx-2 p-2 cursor-pointer hover:text-teal-400">
            <a
              onClick={() => {
                router.push("/");
              }}
            >
              Home
            </a>
          </li>

          <li className="mx-2 p-2 cursor-pointer hover:text-teal-400">
            <a onClick={handleLogout}>Log Out</a>
          </li>
        </ul>
      </div>
    </>
  );
}
