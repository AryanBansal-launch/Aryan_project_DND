import { cookies } from "next/headers";
import DocsClient from "./DocsClient";
import PasswordFormWrapper from "./PasswordFormWrapper";

export default async function DocsPage() {
  // Check if user is authenticated
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("docs_authenticated")?.value === "true";

  // If not authenticated, show password form
  if (!isAuthenticated) {
    return <PasswordFormWrapper />;
  }

  return <DocsClient />;
}
