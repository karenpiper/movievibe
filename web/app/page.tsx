"use client";
import dynamic from "next/dynamic";

// Avoid SSR issues with BrowserRouter by loading on client only
const App = dynamic(() => import("../components/App"), { ssr: false });

export default function Page() {
  return <App />;
}
