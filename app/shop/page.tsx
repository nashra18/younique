// app/shop/page.tsx
import { Suspense } from "react";
import Navbar from "@/components/(homepage)/Navbar"; // adjust to where your Navbar lives
import ShopItems from "@/components/(shoppage)/ShopItems";

export default function Page() {
  return (
    <>
      <Navbar waitForPreloader={false} />
      <main>
        {/* Suspense is required because ShopPage reads ?category= from the URL */}
        <Suspense fallback={null}>
            
          <ShopItems />
        </Suspense>
      </main>
    </>
  );
}