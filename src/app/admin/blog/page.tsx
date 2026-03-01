import { createClient } from "@/lib/supabase/server";
import AdminBlogClient from "@/components/admin/AdminBlogClient";

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
  return <AdminBlogClient posts={posts || []} />;
}