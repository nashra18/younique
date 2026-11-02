import Hero2 from "@/components/(homepage)/Hero2";
import Hero3 from "@/components/(homepage)/Hero3";
import Hero from "@/components/(homepage)/Hero3";
import Hero4 from "@/components/(homepage)/Hero4";
import Hero5 from "@/components/(homepage)/Hero5";
import Hero6 from "@/components/(homepage)/Hero6";
import Navbar from "@/components/(homepage)/Navbar";
import PromoBar from "@/components/(homepage)/Promobar";
import ShopItems from "@/components/(shoppage)/ShopItems";
import Image from "next/image";

export default function Home() {
  return (
   <>
   <Navbar cartCount={0} wishlistCount={0} />
<Hero6/>
<ShopItems />
</>
  );
}
