// app/actions/updateBrandStatus.ts
"use server";

import { apiEndpoints } from "@/lib/constants";
import fetchApi from "@/lib/fetchApi";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function SubmitBrand(brand_id: number, status: number) {
  if (brand_id == null || status == null) return;

  const token = (await cookies()).get("accessToken")?.value || "";

  const payload = {
    status: status,
  };

  const response = await fetchApi(apiEndpoints.submitBrands(brand_id), {
    method: "POST",
    accessToken: token,
    body: payload,
    headers: { "Content-Type": "application/json" },
  });

  if (response?.success) {
    revalidatePath("/admin/brand");
  }
}

export async function updateBrandStatus(brand_id: number, status: number) {
  if (brand_id == null || status == null) return;

  const token = (await cookies()).get("accessToken")?.value || "";

  const payload = {
    status: status,
  };
  const response = await fetchApi(apiEndpoints.BrandStatus(brand_id), {
    method: "POST",
    accessToken: token,
    body: payload,
    headers: { "Content-Type": "application/json" },
  });

  return response;
}
