// app/page.tsx
import Navbar from "@/components/(homepage)/Navbar";
import Hero6 from "@/components/(homepage)/Hero6";
import ShopItems from "@/components/(shoppage)/ShopItems";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero6 />
      {/* <ShopItems /> */}
    </>
  );
}