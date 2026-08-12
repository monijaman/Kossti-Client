"use client";
import { useState } from "react";
import Cookies from "js-cookie";
import { getApiUrl } from "@/lib/apiUrl";

export default function FeedbackAdminPage() {
  const [productId, setProductId] = useState(""); const [content, setContent] = useState("");
  const [rating, setRating] = useState("5"); const [sourceUrl, setSourceUrl] = useState("");
  const [message, setMessage] = useState("");
  async function submit(e: React.FormEvent) { e.preventDefault(); setMessage("");
    const token = Cookies.get("accessToken") || "";
    const response = await fetch(`${getApiUrl()}/product-feedback/${productId}`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ content, rating, source_url: sourceUrl || undefined }) });
    const data = await response.json(); setMessage(response.ok ? "Feedback added successfully." : (data.error || "Could not add feedback."));
    if (response.ok) { setContent(""); setSourceUrl(""); }
  }
  return <main className="max-w-3xl p-6"><h1 className="mb-2 text-2xl font-bold">Manage Feedback</h1><p className="mb-6 text-gray-600">Add user feedback, Google reviews, or other reference feedback separately from editorial reviews.</p>
    <form onSubmit={submit} className="space-y-4 rounded-lg border bg-white p-6 shadow-sm">
      <input required type="number" min="1" value={productId} onChange={e => setProductId(e.target.value)} placeholder="Product ID" className="w-full rounded border p-3" />
      <textarea required minLength={3} maxLength={500} value={content} onChange={e => setContent(e.target.value)} placeholder="Feedback / review text" className="min-h-32 w-full rounded border p-3" />
      <select value={rating} onChange={e => setRating(e.target.value)} className="rounded border p-3">{[5,4,3,2,1].map(n => <option key={n} value={n}>{n} / 5</option>)}</select>
      <input type="url" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} placeholder="Reference URL (Google review, etc.)" className="w-full rounded border p-3" />
      <button className="rounded bg-blue-600 px-5 py-2 font-medium text-white">Add feedback</button>{message && <p className="text-sm text-gray-600">{message}</p>}
    </form></main>;
}
