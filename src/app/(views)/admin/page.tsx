// app/admin/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import UserCredentials from "../../lib/definitions/auth/UserCredentials";
import LoadSpinner from "../../components/LoadSpinner";

export default function Admin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    isAuthenticated()
      .then((result) => {
        setIsAuth(result);
        if (result) {
          router.push("/admin/dashboard");
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router, isAuth]);

  const isAuthenticated = async () => {
    return (await fetch("/api/admin/verifyAuth")).ok;
  };

  const validateFormInput = (credentials: UserCredentials) => {
    if (!credentials.email) {
      throw new Error(`Email not provided`);
    }

    if (!credentials.password) {
      throw new Error(`Password not provided`);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const credentials: UserCredentials = {
        email: formData.get("email")?.toString(),
        password: formData.get("password")?.toString(),
      };

      validateFormInput(credentials);

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      setIsAuth(response.ok);
    } catch (error) {
      console.error("Auth Error: " + error);
    }
  };

  if (isLoading) {
    return <LoadSpinner />;
  } else {
    if (!isAuth) {
      return (
        <>
          <div className="w-screen h-screen mx-auto flex justify-center items-center">
            <form
              className="flex p-16 flex-col items-center border-2 rounded"
              onSubmit={handleSubmit}
            >
              <h1 className="w-fit my-8 px-4 font-bold text-lg ">
                Log In to DiffStudio
              </h1>
              <input
                className="my-8 px-4 py-2 bg-inherit border-2 rounded"
                type="email"
                name="email"
                placeholder="Email"
                required
              />
              <input
                className="my-8 px-4 py-2 bg-inherit border-2 rounded"
                type="password"
                name="password"
                placeholder="Password"
                required
              />
              <button
                className="w-fit px-4 py-2 bg-teal-800 hover:bg-teal-600 font-bold rounded"
                type="submit"
              >
                Login
              </button>
            </form>
          </div>
        </>
      );
    }
  }
}
