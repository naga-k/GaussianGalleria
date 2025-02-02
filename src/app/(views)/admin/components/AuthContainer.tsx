// app/admin/page.tsx
"use client";
import LoadSpinner from "@/src/app/components/LoadSpinner";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

type FallbackFunction = () => void;

interface AuthContainerProps {
  fallback: FallbackFunction | null;
  children: ReactNode;
}

export default function AuthContainer({
  fallback = null,
  children,
}: AuthContainerProps) {
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
          if (fallback) {
            fallback();
          } else {
            return null;
          }
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router, isAuth, fallback]);

  const handleAuthCheck = async () => {
    return await fetch("/api/admin/verifyAuth");
  };

  if (isLoading) {
    return <LoadSpinner />;
  } else {
    if (isAuth) {
      return <>{children}</>;
    }
  }
}
