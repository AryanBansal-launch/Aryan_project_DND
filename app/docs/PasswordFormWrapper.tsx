"use client";

import PasswordForm from "./PasswordForm";
import { useRouter } from "next/navigation";

export default function PasswordFormWrapper() {
  const router = useRouter();

  const handleSuccess = () => {
    // Refresh the page to show the docs options
    router.refresh();
  };

  return <PasswordForm onSuccess={handleSuccess} />;
}

