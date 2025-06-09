"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { StarIcon } from "@heroicons/react/20/solid";
import { HeartIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import {
  getProducts,
  getProductsByCategory,
  addToCart,
  addToWishlist,
  isInWishlist,
} from "@/utils/api";
import { getPlaceholderImage } from "@/utils/cloudinary";
import Link from "next/link";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  imageUrl: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
}

interface ProductGridProps {
  selectedCategory?: string;
  searchQuery?: string;
}

type ImageState = "loading" | "loaded" | "error";

export default function ProductGrid({
  selectedCategory = "all",
  searchQuery = "",
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());
  const [imageStates, setImageStates] = useState<{ [key: string]: ImageState }>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data: Product[] =
          selectedCategory === "all"
            ? await getProducts()
            : await getProductsByCategory(selectedCategory);

        // Apply search filtering with explicit typing
        const filteredData = (data as Product[]).filter(
          (product: Product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setProducts(filteredData);

        // Initialize image states for filtered products
        const initialImageStates = filteredData.reduce(
          (acc: { [key: string]: ImageState }, product: Product) => {
            acc[product.id] = "loading";
            return acc;
          },
          {}
        );
        setImageStates(initialImageStates);

        // Check wishlist status for each product
        const wishlistPromises = filteredData.map((product: Product) =>
          isInWishlist(product.id)
        );
        const wishlistStatuses = await Promise.all(wishlistPromises);
        const wishlistSet = new Set(
          filteredData
            .filter((_: Product, index: number) => wishlistStatuses[index])
            .map((product: Product) => product.id)
        );
        setWishlistItems(wishlistSet as Set<string>);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    try {
      await addToCart(product.id);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const handleAddToWishlist = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    try {
      await addToWishlist(product.id);
      setWishlistItems((prev) => new Set([...Array.from(prev), product.id]));
      toast.success(`${product.name} added to wishlist`);
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error("Product already in wishlist");
      } else {
        console.error("Failed to add to wishlist:", error);
        toast.error("Failed to add to wishlist");
      }
    }
  };

  const handleImageLoad = (productId: string) => {
    setImageStates((prev) => ({
      ...prev,
      [productId]: "loaded",
    }));
  };

  const handleImageError = (productId: string, category: string, e: any) => {
    if (e.target) {
      const target = e.target as HTMLImageElement;
      const fallbackUrl = getPlaceholderImage(category);
      if (target.src !== fallbackUrl) {
        target.src = fallbackUrl;
      }
    }
    setImageStates((prev) => ({
      ...prev,
      [productId]: "error",
    }));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-4">
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">
        {selectedCategory === "all"
          ? "All Products"
          : `${selectedCategory} Products`}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product: Product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
          >
            <Link href={`/products/${product.id}`}>
              <div className="relative aspect-square">
                {imageStates[product.id] === "loading" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                  </div>
                )}
                <Image
                  src={
                    product.imageUrl || getPlaceholderImage(product.category)
                  }
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className={`object-cover transition-opacity duration-300 ${
                    imageStates[product.id] === "loaded"
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                  priority={product.isFeatured}
                  onLoad={() => handleImageLoad(product.id)}
                  onError={(e) =>
                    handleImageError(product.id, product.category, e)
                  }
                />
                {imageStates[product.id] === "error" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-0">
                    <svg
                      className="w-8 h-8 text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-xs text-gray-500">
                      Image not available
                    </span>
                  </div>
                )}

                <div className="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <button
                    onClick={(e) => handleAddToWishlist(e, product)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                  >
                    {wishlistItems.has(product.id) ? (
                      <HeartIconSolid className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                  {product.inStock && (
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                    >
                      <ShoppingCartIcon className="h-5 w-5 text-gray-600" />
                    </button>
                  )}
                </div>
                {product.isOnSale && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded z-20">
                    SALE
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm text-gray-500 mb-1">
                  {product.category}
                </h3>
                <h2 className="font-semibold text-gray-900 mb-2">
                  {product.name}
                </h2>
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < product.rating
                            ? "text-yellow-400"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    ({product.reviewCount})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${Number(product.oldPrice).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      product.inStock ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}