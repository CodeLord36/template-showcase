import { medusa } from "@/lib/medusa";
import { useEffect } from "react";

export default function Text() {
  useEffect(() => {
    medusa.store.product
      .list()
      .then(({ products }) => {
        console.log("Products: ", products);
      })
      .catch((error) => {
        console.error("Error fetching products: ", error);
      });
  }, []);

  return (
    <div>
      <h1>Test Page</h1>
      <p>Check console for Medusa data</p>
    </div>
  );
}
