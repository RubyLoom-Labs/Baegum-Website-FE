import { useParams } from "react-router-dom";
import ClothingProductPage from "./ClothingProductPage";
import StandardProductPage from "./StandardProductPage";

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT PAGE ROUTER
//
//  Route: /products/:category/:id
//  e.g.   /products/clothing/1  → ClothingProductPage
//         /products/fragrance/1 → StandardProductPage
// ─────────────────────────────────────────────────────────────────────────────

const CLOTHING_CATEGORIES = ["clothing"];

export default function ProductPage() {
  const { category } = useParams();

  if (CLOTHING_CATEGORIES.includes(category)) {
    return <ClothingProductPage />;
  }

  return <StandardProductPage />;
}