import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = { title: "Admin | Zaro Bakehouse" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const adminAuth = cookieStore.get("admin_auth");

  if (!adminAuth || adminAuth.value !== "zaro2024admin") {
    redirect("/adminlogin");
  }

  return (
    <div className="min-h-screen bg-accent flex">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}