"use client";
import { useUserActions } from "@/lib/store/hooks/useUserActions";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type Inputs = {
  name: string;
  price: number;
  description: string;
  image: FileList; // Changed to FileList type
  category: string;
};

const ProductCreate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const { createProduct } = useUserActions();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name.trim());
      formData.append("price", Number(data.price).toString());
      formData.append("description", data.description.trim());
      formData.append("category", data.category.trim());
      formData.append("image", data.image[0]);
  
      const result = await createProduct(formData);
      if (result) {
        toast.success("Product created successfully!");
      }
    } catch (error) {
      console.error("Creation error:", error);
      toast.error(error instanceof Error ? error.message : "Creation failed");
    }
  };

  return (
    <div className="space-y-4 flex flex-col justify-center items-center">
      {/* ... existing header ... */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full overflow-hidden rounded-lg shadow-lg bg-gray-800 p-4 space-y-1"
        encType="multipart/form-data" // Add form encoding type
      >
        {/* Name Field */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 bg-gray-700 rounded-lg placeholder:text-gray-400 placeholder:text-center"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <span className="text-red-500">{errors.name.message}</span>
          )}
        </div>

        {/* Description Field */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Description"
            className="w-full p-2 bg-gray-700 rounded-lg placeholder:text-gray-400 placeholder:text-center"
            {...register("description", { required: "Description is required" })}
          />
          {errors.description && (
            <span className="text-red-500">{errors.description.message}</span>
          )}
        </div>

        {/* Category Field */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Category"
            className="w-full p-2 bg-gray-700 rounded-lg placeholder:text-gray-400 placeholder:text-center"
            {...register("category", { required: "Category is required" })}
          />
          {errors.category && (
            <span className="text-red-500">{errors.category.message}</span>
          )}
        </div>

        {/* Price Field */}
        <div className="flex flex-col gap-4">
          <input
            type="number"
            placeholder="Price"
            className="w-full p-2 bg-gray-700 rounded-lg placeholder:text-gray-400 placeholder:text-center"
            {...register("price", {
              required: "Price is required",
              valueAsNumber: true,
              min: { value: 0, message: "Price must be positive" }
            })}
          />
          {errors.price && (
            <span className="text-red-500">{errors.price.message}</span>
          )}
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-4">
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 bg-gray-700 rounded-lg placeholder:text-gray-400 placeholder:text-center"
            {...register("image", {
              required: "Image is required",
              validate: {
                validType: (files) => 
                  files?.[0]?.type.startsWith("image/") || "Invalid file type",
                maxSize: (files) =>
                  files?.[0]?.size <= 5_000_000 || "Max file size is 5MB"
              }
            })}
          />
          {errors.image && (
            <span className="text-red-500">{errors.image.message}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 mt-4 text-white bg-green-500 rounded-lg hover:bg-green-600 w-full disabled:bg-gray-500"
        >
          {isSubmitting ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductCreate;