import { BLOCKED_PRODUCT_SLUGS, LOCALES, SITE_URL } from "@/lib/constants";
import { MetadataRoute } from "next";
import fetchApi from "@/lib/fetchApi";
import { Product } from "@/lib/types";

// This would ideally fetch from your API
// For now, we'll generate basic routes
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  // Static pages for each locale
  const staticPages: MetadataRoute.Sitemap = [];

  LOCALES.forEach((locale) => {
    staticPages.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    });
  });

  let products: Product[] = [];
  try {
    const response = await fetchApi<{ data: Product[] }>("/products", {
      queryParams: { per_page: 10000 },
      next: { revalidate: 3600 },
    });
    products = response.success ? (response.data?.data || []) : [];
  } catch {
    products = [];
  }

  const productPages = products.filter((product) => !BLOCKED_PRODUCT_SLUGS.has(product.slug.toLowerCase())).flatMap((product) =>
    LOCALES.map((locale) => ({
      url: `${baseUrl}/${locale}/${product.category_slug || "products"}/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  return [
    ...staticPages,
    ...productPages,
  ];
}
