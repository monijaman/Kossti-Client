import { ReactNode } from "react";
interface AuthLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: AuthLayoutProps) {
  return <>{children}</>;
}
