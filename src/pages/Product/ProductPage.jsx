import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClothingProductPage from "./ClothingProductPage";
import StandardProductPage from "./StandardProductPage";
import { getProductDetail } from "@/services/product";
import { transformProductData } from "@/utils/productTransformer";

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT PAGE ROUTER
//
//  Route: /products/:category/:id
//  e.g.   /products/clothing/1  → ClothingProductPage
//         /products/fragrance/1 → StandardProductPage
// ─────────────────────────────────────────────────────────────────────────────

const CLOTHING_CATEGORIES = ["clothing"];

export default function ProductPage() {
  const { category, id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiData = await getProductDetail(id);
        const transformedProduct = transformProductData(apiData);
        setProduct(transformedProduct);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-500">Failed to load product. Please try again.</p>
      </div>
    );
  }

  if (CLOTHING_CATEGORIES.includes(category)) {
    return <ClothingProductPage product={product} categoryId={product.categoryId} />;
  }

  return <StandardProductPage product={product} />;
}
