// app/page.tsx
import Navbar from "@/components/(homepage)/Navbar";
import Hero6 from "@/components/(homepage)/Hero6";
import ShopItems from "@/components/(shoppage)/ShopItems";
import New_aarivalsNBestSeller from "@/components/(homepage)/New_aarivalsNBestSeller";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero6 />
      <New_aarivalsNBestSeller />
      {/* <ShopItems /> */}
    </>
  );
}