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
  content_en?: string;
  content_bn?: string;
  translations?: Record<string, string>;
};

type ProductOption = { id: number; name: string; slug?: string };

const getToken = () =>
  (typeof window !== "undefined" ? localStorage.getItem("token") : null) ||
  Cookies.get("accessToken") || Cookies.get("theAccessToken") || "";

export default function FeedbackAdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [productId, setProductId] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [searchingProducts, setSearchingProducts] = useState(false);
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

  useEffect(() => {
    const term = productSearch.trim();
    if (term.length < 2 || productId) {
      setProductOptions([]);
      return;
    }
    const timer = window.setTimeout(async () => {
      setSearchingProducts(true);
      try {
        const response = await fetch(`${getApiUrl()}/products?search=${encodeURIComponent(term)}&limit=20&page=1&include_inactive=true`, { cache: "no-store" });
        const data = await response.json();
        const products = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        setProductOptions(products.map((item: ProductOption) => ({ id: item.id, name: item.name, slug: item.slug })));
      } catch {
        setProductOptions([]);
      } finally {
        setSearchingProducts(false);
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [productSearch, productId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const response = await fetch(`${getApiUrl()}/product-feedback/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ content, locale: "en", rating, source_url: sourceUrl || undefined }),
    });
    const data = await response.json();
    setMessage(response.ok ? "Feedback added successfully." : (data.error || "Could not add feedback."));
    if (response.ok) {
      setProductId(""); setProductSearch(""); setContent(""); setSourceUrl("");
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
    setMessage("");
    try {
      const response = await fetch(`${getApiUrl()}/feedback/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        let errorMessage = errorText;
        try { errorMessage = JSON.parse(errorText).error || errorText; } catch { /* backend may return plain text */ }
        throw new Error(errorMessage || "Could not delete feedback.");
      }

      // Remove it immediately. DELETE returns 204, so there is no response JSON
      // to parse, and a failed refresh should not make the deleted card reappear.
      setFeedbacks(current => current.filter(item => item.id !== id));
      setMessage("Feedback deleted successfully.");
      await loadFeedbacks();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete feedback.");
    }
  }

  async function translateFeedback(item: Feedback, targetLocale: "en" | "bn") {
    setMessage(`Translating feedback #${item.id}...`);
    try {
      const source = targetLocale === "en" ? item.content_bn || item.content : item.content_en || item.content;
      const translationResponse = await fetch("/api/ai/translate-bengali", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: source, targetLocale }),
      });
      const translation = await translationResponse.json();
      if (!translationResponse.ok || !translation.data) throw new Error(translation.error || "Translation failed");
      const saveResponse = await fetch(`${getApiUrl()}/feedback/${item.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(targetLocale === "en" ? { content_en: translation.data } : { content_bn: translation.data }),
      });
      if (!saveResponse.ok) {
        const errorText = await saveResponse.text().catch(() => "");
        throw new Error(errorText || "Could not save translation");
      }
      setFeedbacks(current => current.map(row => row.id === item.id
        ? { ...row, ...(targetLocale === "en" ? { content_en: translation.data } : { content_bn: translation.data }) }
        : row));
      setMessage(`Feedback #${item.id} translated to ${targetLocale === "en" ? "English" : "Bangla"}.`);
      await loadFeedbacks();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Translation failed"); }
  }

  if (!authorized) return null;

  return <main className="max-w-6xl p-6">
    <h1 className="mb-2 text-2xl font-bold">Manage Feedback</h1>
    <p className="mb-6 text-gray-600">Create, review, edit, and delete user feedback and reference reviews.</p>

    <form onSubmit={submit} className="mb-8 space-y-4 rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Add feedback</h2>
      <div className="relative">
        <input required value={productSearch} onChange={e => { setProductSearch(e.target.value); setProductId(""); }} placeholder="Search product by name" className="w-full rounded border p-3" />
        {searchingProducts && <p className="mt-1 text-xs text-gray-500">Searching products...</p>}
        {productOptions.length > 0 && <div className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded border bg-white shadow-lg">
          {productOptions.map(product => <button type="button" key={product.id} onClick={() => { setProductId(String(product.id)); setProductSearch(`${product.name} (#${product.id})`); setProductOptions([]); }} className="block w-full border-b px-3 py-2 text-left text-sm hover:bg-blue-50">
            <span className="font-medium">{product.name}</span><span className="ml-2 text-gray-500">#{product.id}</span>
          </button>)}
        </div>}
        {productId && <p className="mt-1 text-xs text-green-700">Selected product ID: {productId}</p>}
      </div>
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
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="rounded border bg-blue-50 p-3 text-gray-900"><p className="mb-1 text-xs font-semibold text-blue-700">English</p><p className="whitespace-pre-wrap text-sm text-gray-900">{item.content_en || item.content}</p></div>
              <div className="rounded border bg-green-50 p-3 text-gray-900"><p className="mb-1 text-xs font-semibold text-green-700">Bangla</p><p className="whitespace-pre-wrap text-sm text-gray-900">{item.content_bn || "Not translated yet"}</p></div>
            </div>
            <p className="mt-2 text-sm text-amber-600">{"★".repeat(Math.max(0, Math.min(5, Number(item.rating) || 0)))}{"☆".repeat(Math.max(0, 5 - Math.min(5, Number(item.rating) || 0)))} <span className="ml-1">{item.rating || "—"} / 5</span></p>
            <p className="mt-1 text-xs text-gray-500">User: {item.user_id} · {item.created_at ? new Date(item.created_at).toLocaleString() : ""}</p>
            <div className="mt-4">
              <button type="button" onClick={() => startEdit(item)} className="mr-2 rounded bg-gray-800 px-4 py-2 text-sm text-white">Edit</button>
              <button type="button" onClick={() => void removeFeedback(item.id)} className="rounded bg-red-600 px-4 py-2 text-sm text-white">Delete</button>
              <button type="button" onClick={() => void translateFeedback(item, "en")} className="ml-2 rounded bg-blue-600 px-4 py-2 text-sm text-white">Translate English</button>
              <button type="button" onClick={() => void translateFeedback(item, "bn")} className="ml-2 rounded bg-green-600 px-4 py-2 text-sm text-white">Translate Bangla</button>
            </div>
            {item.source_url && <p className="mt-3 border-t border-gray-100 pt-2 text-sm text-gray-500">Source: <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="break-all text-blue-600 hover:underline">{item.source_url}</a></p>}
          </>}
        </article>)}
      </div>}
  </main>;
}
