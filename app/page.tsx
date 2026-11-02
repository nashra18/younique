// app/page.tsx
import Navbar from "@/components/(homepage)/Navbar";
import Hero6 from "@/components/(homepage)/Hero6";
import ShopItems from "@/components/(shoppage)/ShopItems";
import New_aarivalsNBestSeller from "@/components/(homepage)/New_aarivalsNBestSeller";
import About from "@/components/(homepage)/About";
import Faq from "@/components/(homepage)/Faqs";
import Footer from "@/components/(homepage)/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero6 />
      <New_aarivalsNBestSeller />

      <About />
      <Faq />
      <Footer />
      {/* <ShopItems /> */}
    </>
  );
}