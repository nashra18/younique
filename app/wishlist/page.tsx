// app/wishlist/page.tsx
import Navbar from "@/components/(homepage)/Navbar"; // adjust to where your Navbar lives
import WishlistPage from "@/components/(shoppage)/WishlistPage";

export default function Page() {
  return (
    <>
      <Navbar waitForPreloader={false} />
      <main>
        <WishlistPage />
      </main>
    </>
  );
}