// app/actions/updateBrandStatus.ts
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import fetchApi from '@/lib/fetchApi';
import { apiEndpoints } from '@/lib/constants';

export async function updateBrandStatus(brand_id: number, status: number) {
  if (brand_id == null || status == null) return;

  const token = (await cookies()).get("accessToken")?.value || "";

  const response = await fetchApi(
    apiEndpoints.submitBrands(brand_id),
    {
      method: 'POST',
      accessToken: token,
      body: { status },
      headers: { 'Content-Type': 'application/json' },
    }
  );

  if (response?.success) {
    revalidatePath('/admin/brands');
  }
}
