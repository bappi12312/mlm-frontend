import ProductsCard from "@/components/share/ProductsCard"
import { demoProduct, products } from "@/lib/utils/demo"



const ProductPage = () => {
  const productss: demoProduct[] = products || []
  return (
    <div className="container w-full space-y-20">
      <div className="flex justify-center h-full">
        <h1 className="text-2xl md:text-3xl font-bold text-main">Featured Products</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {
        productss && productss?.map((product) => (
          <ProductsCard key={product._id} product={product} />
        ))
      }
      </div>
    </div>
  )
}

export default ProductPage