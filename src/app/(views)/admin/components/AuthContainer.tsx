// app/admin/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface AuthContainerProps {
  children: ReactNode;
}

export default function AuthContainer({ children }: AuthContainerProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    handleAuthCheck()
      .then((response) => {
        const result = response.ok;
        setIsAuth(result);
        if (!result) {
          router.push("/admin");
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router, isAuth]);

  const handleAuthCheck = async () => {
    return await fetch("/api/admin/verifyAuth");
  };

  if (isLoading) {
    return <>Validating Auth...</>;
  } else {
    if (isAuth) {
      return <>{children}</>;
    }
  }
}
