import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TRDClient from "./TRDClient";

export default async function TRDPage() {
  // Check if user is authenticated
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("docs_authenticated")?.value === "true";

  // If not authenticated, redirect to docs page
  if (!isAuthenticated) {
    redirect("/docs");
  }

  return <TRDClient />;
}

