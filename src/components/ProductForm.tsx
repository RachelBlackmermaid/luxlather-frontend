import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/api";
import type { Product } from "../types/product";

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  imageSrc: z.string().min(1, "Image is required").url("Must be a valid image URL"),
  description: z.string().min(5, "Description is too short"),
  price: z.number().min(1, "Price must be at least 1"),
  category: z.enum(["oil", "soap"]),
});

type ProductFormData = z.infer<typeof schema>;

type Props = {
  product?: Product | null;
  onSave: () => void;
  defaultCategory: "oil" | "soap";
};

const ProductForm = ({ product, onSave, defaultCategory }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product?.name ?? "",
      imageSrc: product?.imageSrc ?? "",
      description: product?.description ?? "",
      price: typeof product?.price === "number" ? product!.price : 0,
      category: (product?.category as "oil" | "soap") ?? defaultCategory,
    },
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Rehydrate form when switching create/edit
  useEffect(() => {
    if (product) {
      setValue("name", product.name ?? "");
      setValue("imageSrc", product.imageSrc ?? "");
      setValue("description", product.description ?? "");
      setValue("price", typeof product.price === "number" ? product.price : 0);
      setValue("category", (product.category as "oil" | "soap") ?? defaultCategory);
    } else {
      reset({
        name: "",
        imageSrc: "",
        description: "",
        price: 0,
        category: defaultCategory,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, defaultCategory]);

  // Upload image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { imageUrl } = res.data || {};
      if (typeof imageUrl === "string" && imageUrl.length > 0) {
        setValue("imageSrc", imageUrl);
      } else {
        setUploadError("No URL returned from upload");
      }
    } catch (err: any) {
      console.error("Image upload error:", err);
      setUploadError(err?.response?.data?.error || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (product?._id) {
        await api.patch(`/products/${product._id}`, data);
      } else {
        await api.post("/products", data);
      }

      reset({
        name: "",
        imageSrc: "",
        description: "",
        price: 0,
        category: defaultCategory,
      });
      setPreviewUrl("");
      onSave();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error saving product:", err);
      setErrorMessage(err?.response?.data?.error || "Failed to save product. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border border-gray-200 p-8 rounded-xl shadow-lg space-y-6 bg-white"
    >
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50"
          >
            ✅ Product saved successfully!
          </motion.div>
        )}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50"
          >
            ❌ {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <h3 className="text-2xl font-bold mb-4">
        {product ? "✏️ Edit Product" : "➕ Add New Product"}
      </h3>

      {/* Name */}
      <div className="flex flex-col">
        <label className="font-medium mb-1">Product Name</label>
        <input
          type="text"
          placeholder="e.g. Lavender Oil"
          {...register("name")}
          className="border px-4 py-2 rounded-md"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      {/* Image Upload */}
      <div className="flex flex-col">
        <label className="font-medium mb-1">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="border px-4 py-2 rounded-md bg-white"
        />
        {uploading && <p className="text-blue-500 text-sm mt-1">Uploading...</p>}
        {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}

        <input
          type="text"
          readOnly
          {...register("imageSrc")}
          className="mt-2 bg-gray-100 text-gray-600 border px-3 py-2 rounded text-sm"
        />
        {errors.imageSrc && <p className="text-red-500 text-sm">{errors.imageSrc.message}</p>}
      </div>

      {previewUrl && (
        <img src={previewUrl} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded border" />
      )}
      {!previewUrl && product?.imageSrc && (
        <img src={product.imageSrc} alt="Current" className="mt-2 w-32 h-32 object-cover rounded border" />
      )}

      {/* Description */}
      <div className="flex flex-col">
        <label className="font-medium mb-1">Description</label>
        <textarea
          {...register("description")}
          placeholder="Brief product details"
          className="border px-4 py-2 rounded-md"
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      {/* Price */}
      <div className="flex flex-col">
        <label className="font-medium mb-1">Price</label>
        <input
          type="number"
          min={0}
          step="0.01"
          {...register("price", { valueAsNumber: true })}
          className="border px-4 py-2 rounded-md"
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
      </div>

      {/* Category */}
      <div className="flex flex-col">
        <label className="font-medium mb-1">Category</label>
        <select {...register("category")} className="border px-4 py-2 rounded-md">
          <option value="oil">Essential Oil</option>
          <option value="soap">Liquid Soap</option>
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={uploading}
        className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-60"
      >
        {product ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
};

export default ProductForm;
