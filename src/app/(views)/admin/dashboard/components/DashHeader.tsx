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
      <header className="min-w-screen p-4 flex flex-row justify-between items-center">
        <div className="mx-2 p-2 font-bold text-lg hover:text-teal-400">
          <p>GaussianGallery Dashboard</p>
        </div>

        <ul className="flex flex-row justify-between list-none">
          <li className="mx-2 p-2 cursor-pointer hover:text-teal-400">
            <a
              onClick={() => {
                router.push("/admin/dashboard");
              }}
            >
              Manage Splats
            </a>
          </li>
          <li className="mx-2 p-2 cursor-pointer hover:text-teal-400">
            <a
              onClick={() => {
                router.push("/admin/dashboard/galleries");
              }}
            >
              Manage Galleries
            </a>
          </li>
          <li className="mx-2 p-2 cursor-pointer hover:text-teal-400">
            <a
              onClick={() => {
                router.push("/");
              }}
            >
              Galleries
            </a>
          </li>
          <li className="mx-2 p-2 cursor-pointer hover:text-red-400">
            <a onClick={handleLogout}>Log Out</a>
          </li>
        </ul>
      </header>
    </>
  );
}
