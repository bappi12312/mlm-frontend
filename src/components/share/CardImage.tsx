import Image from "next/image"
const CardImage = ({url}: {url: string}) => {
  return (
    <div className="sm:hover:scale-105 sm:transition-all sm:duration-300 flex justify-center items-center my-4">
      <Image 
      src={url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500"}
      alt="image is processing"
      width={300}
      height={300}
      className="rounded-md object-contain"
      />
    </div>
  )
}

export default CardImage