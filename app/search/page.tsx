// app/search/page.tsx
import Navbar from "@/components/(homepage)/Navbar"; // adjust to where your Navbar lives
import SearchResults from "@/components/(shoppage)/Searchbar";

export default function Page() {
  return (
    <>
      <Navbar waitForPreloader={false} />
      <main>
        <SearchResults />
      </main>
    </>
  );
}