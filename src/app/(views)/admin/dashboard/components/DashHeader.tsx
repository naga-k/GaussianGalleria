import { useRouter } from "next/navigation";

export default function DashHeader() {
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
      <header className="min-w-screen mx-4 p-4 flex flex-row justify-between items-center">
        <div className="font-bold text-lg hover:text-teal-400">
          <p>GaussianGallery Dashboard</p>
        </div>

        <ul className="flex flex-row justify-between list-none">
          <li
            onClick={() => {
              router.push("/admin/dashboard");
            }}
            className="mx-2 p-2 cursor-pointer hover:text-teal-400"
          >
            Manage Splats
          </li>
          <li
            onClick={() => {
              router.push("/admin/dashboard/galleries");
            }}
            className="mx-2 p-2 cursor-pointer hover:text-teal-400"
          >
            Manage Galleries
          </li>
          <li
            onClick={() => {
              router.push("/");
            }}
            className="mx-2 p-2 cursor-pointer hover:text-teal-400"
          >
            Galleries
          </li>
          <li
            onClick={handleLogout}
            className="mx-2 p-2 cursor-pointer hover:text-red-400"
          >
            Log Out
          </li>
        </ul>
      </header>
    </>
  );
}
