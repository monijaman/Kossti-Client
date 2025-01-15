import { ReactNode } from "react";
interface pageProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: pageProps) {
  return <>{children}</>;
}
