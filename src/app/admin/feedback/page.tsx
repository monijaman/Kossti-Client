"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getApiUrl } from "@/lib/apiUrl";

type Feedback = {
  id: number;
  product_id: number;
  content: string;
  rating: string;
  source_url?: string | null;
  status: number;
  user_id: number;
  created_at: string;
};

const getToken = () =>
  (typeof window !== "undefined" ? localStorage.getItem("token") : null) ||
  Cookies.get("accessToken") || Cookies.get("theAccessToken") || "";

export default function FeedbackAdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [productId, setProductId] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState("5");
  const [sourceUrl, setSourceUrl] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState("5");
  const [editSourceUrl, setEditSourceUrl] = useState("");
  const [editStatus, setEditStatus] = useState(1);

  const loadFeedbacks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${getApiUrl()}/feedback?limit=1000`, {
        cache: "no-store",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load feedback");
      setFeedbacks(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load feedback");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("userType")?.trim().toLowerCase() !== "admin") {
      router.replace("/admin");
      return;
    }
    setAuthorized(true);
    void loadFeedbacks();
  }, [loadFeedbacks, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const response = await fetch(`${getApiUrl()}/product-feedback/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ content, rating, source_url: sourceUrl || undefined }),
    });
    const data = await response.json();
    setMessage(response.ok ? "Feedback added successfully." : (data.error || "Could not add feedback."));
    if (response.ok) {
      setProductId(""); setContent(""); setSourceUrl("");
      await loadFeedbacks();
    }
  }

  function startEdit(item: Feedback) {
    setEditingId(item.id);
    setEditContent(item.content);
    setEditRating(item.rating || "5");
    setEditSourceUrl(item.source_url || "");
    setEditStatus(item.status);
  }

  async function saveEdit(id: number) {
    setMessage("");
    const response = await fetch(`${getApiUrl()}/feedback/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ content: editContent, rating: editRating, source_url: editSourceUrl || undefined, status: editStatus }),
    });
    const data = await response.json();
    if (!response.ok) { setMessage(data.error || "Could not update feedback."); return; }
    setEditingId(null); setMessage("Feedback updated successfully."); await loadFeedbacks();
  }

  async function removeFeedback(id: number) {
    if (!window.confirm("Delete this feedback?")) return;
    const response = await fetch(`${getApiUrl()}/feedback/${id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setMessage(data.error || "Could not delete feedback."); return;
    }
    setMessage("Feedback deleted successfully."); await loadFeedbacks();
  }

  if (!authorized) return null;

  return <main className="max-w-6xl p-6">
    <h1 className="mb-2 text-2xl font-bold">Manage Feedback</h1>
    <p className="mb-6 text-gray-600">Create, review, edit, and delete user feedback and reference reviews.</p>

    <form onSubmit={submit} className="mb-8 space-y-4 rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Add feedback</h2>
      <input required type="number" min="1" value={productId} onChange={e => setProductId(e.target.value)} placeholder="Product ID" className="w-full rounded border p-3" />
      <textarea required minLength={3} maxLength={2000} value={content} onChange={e => setContent(e.target.value)} placeholder="Feedback / review text" className="min-h-32 w-full rounded border p-3" />
      <p className="text-xs text-gray-500">{2000 - content.length} characters left</p>
      <div className="flex flex-wrap gap-3">
        <select value={rating} onChange={e => setRating(e.target.value)} className="rounded border p-3">{[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} / 5</option>)}</select>
        <input type="url" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} placeholder="Reference URL (optional)" className="min-w-72 flex-1 rounded border p-3" />
      </div>
      <button className="rounded bg-blue-600 px-5 py-2 font-medium text-white">Add feedback</button>
    </form>

    {message && <p className="mb-4 rounded border bg-gray-50 p-3 text-sm text-gray-700">{message}</p>}
    <h2 className="mb-3 text-xl font-semibold">Existing feedback ({feedbacks.length})</h2>
    {loading ? <p className="text-gray-500">Loading feedback...</p> : feedbacks.length === 0 ? <p className="rounded border bg-white p-5 text-gray-500">No feedback found.</p> :
      <div className="space-y-4">
        {feedbacks.map(item => <article key={item.id} className="rounded-lg border bg-white p-5 shadow-sm">
          {editingId === item.id ? <div className="space-y-3">
            <p className="text-sm font-semibold">Feedback #{item.id} · Product #{item.product_id}</p>
            <textarea maxLength={2000} value={editContent} onChange={e => setEditContent(e.target.value)} className="min-h-28 w-full rounded border p-3" />
            <div className="flex flex-wrap gap-3">
              <select value={editRating} onChange={e => setEditRating(e.target.value)} className="rounded border p-3">{[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} / 5</option>)}</select>
              <select value={editStatus} onChange={e => setEditStatus(Number(e.target.value))} className="rounded border p-3"><option value={1}>Active</option><option value={0}>Hidden</option></select>
              <input type="url" value={editSourceUrl} onChange={e => setEditSourceUrl(e.target.value)} placeholder="Reference URL" className="min-w-72 flex-1 rounded border p-3" />
            </div>
            <button type="button" onClick={() => void saveEdit(item.id)} className="mr-2 rounded bg-green-600 px-4 py-2 text-white">Save</button>
            <button type="button" onClick={() => setEditingId(null)} className="rounded border px-4 py-2">Cancel</button>
          </div> : <>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">Feedback #{item.id} · Product #{item.product_id}</p>
              <span className={`rounded px-2 py-1 text-xs ${item.status ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{item.status ? "Active" : "Hidden"}</span>
            </div>
            <p className="whitespace-pre-wrap text-gray-700">{item.content}</p>
            <p className="mt-2 text-xs text-gray-500">Rating: {item.rating || "—"} · User: {item.user_id} · {item.created_at ? new Date(item.created_at).toLocaleString() : ""}</p>
            <div className="mt-4">
              <button type="button" onClick={() => startEdit(item)} className="mr-2 rounded bg-gray-800 px-4 py-2 text-sm text-white">Edit</button>
              <button type="button" onClick={() => void removeFeedback(item.id)} className="rounded bg-red-600 px-4 py-2 text-sm text-white">Delete</button>
            </div>
            {item.source_url && <p className="mt-3 border-t border-gray-100 pt-2 text-sm text-gray-500">Source: <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="break-all text-blue-600 hover:underline">{item.source_url}</a></p>}
          </>}
        </article>)}
      </div>}
  </main>;
}
