import { LOCALES, SITE_URL } from "@/lib/constants";
import { MetadataRoute } from "next";

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

  // TODO: Fetch dynamic product/category pages from API
  // Example:
  // const products = await fetchProducts()
  // const productPages = products.flatMap(product =>
  //   LOCALES.map(locale => ({
  //     url: `${baseUrl}/${locale}/${product.category_slug}/${product.slug}`,
  //     lastModified: new Date(product.updated_at),
  //     changeFrequency: 'weekly',
  //     priority: 0.8,
  //   }))
  // )

  return [
    ...staticPages,
    // ...productPages,
  ];
}
