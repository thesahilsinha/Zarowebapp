"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Search, User, ShoppingBag, Ban, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsersClient({ users }: { users: any[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = users.filter((u) =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  );

  const toggleBlock = async (userId: string, currentlyBlocked: boolean) => {
    setUpdating(userId);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ is_blocked: !currentlyBlocked })
      .eq("id", userId);
    if (error) toast.error("Failed to update user");
    else toast.success(currentlyBlocked ? "User unblocked" : "User blocked");
    router.refresh();
    setUpdating(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground text-sm mt-1">{users.length} registered users</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or phone..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
      </div>

      {/* Users table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-accent/50">
              {["User", "Phone", "Joined", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-brand-600 text-sm">
                        {user.full_name?.[0]?.toUpperCase() || "?"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.full_name || "No name"}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {user.phone || "—"}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric"
                  })}
                </td>
                <td className="px-4 py-3">
                  {user.is_blocked ? (
                    <span className="bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full">Blocked</span>
                  ) : (
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">Active</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleBlock(user.id, user.is_blocked)}
                    disabled={updating === user.id}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                      user.is_blocked
                        ? "bg-green-50 text-green-600 hover:bg-green-100"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                  >
                    {updating === user.id ? "..." : user.is_blocked
                      ? <><CheckCircle size={13} /> Unblock</>
                      : <><Ban size={13} /> Block</>
                    }
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && (
          <div className="py-10 text-center text-muted-foreground text-sm">No users found</div>
        )}
      </div>
    </div>
  );
}