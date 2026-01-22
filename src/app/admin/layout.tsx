// app/layout.tsx
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';
import AdminLayoutClient from './AdminLayoutClient';

export const metadata: Metadata = {
  title: 'Viper Front',
  description: 'By Monir dev',
};

interface AdminLayoutProps {
  children: ReactNode; // Children components
}

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  return <AdminLayoutClient accessToken={accessToken}> {children}</AdminLayoutClient>;
};

export default AdminLayout;