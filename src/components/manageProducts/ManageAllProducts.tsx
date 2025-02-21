
import GetAllProduct from "./GetAllProduct"
import ProductCreate from "./ProductCreate"

const ManageAllProducts = () => {
  return (
    <div className="space-y-4">
      <ProductCreate />
      <GetAllProduct />
    </div>
  )
}

export default ManageAllProducts