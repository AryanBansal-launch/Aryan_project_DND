import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PRDClient from "./PRDClient";

export default async function PRDPage() {
  // Check if user is authenticated
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("docs_authenticated")?.value === "true";

  // If not authenticated, redirect to docs page
  if (!isAuthenticated) {
    redirect("/docs");
  }

  return <PRDClient />;
}

