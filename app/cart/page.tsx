// app/cart/page.tsx
import Navbar from "@/components/(homepage)/Navbar"; // adjust to where your Navbar lives
import CartPage from "@/components/(shoppage)/CartPage";

export default function Page() {
  return (
    <>
      <Navbar waitForPreloader={false} />
      <main>
        <CartPage />
      </main>
    </>
  );
}