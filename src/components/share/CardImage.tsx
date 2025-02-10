import Image from "next/image"
const CardImage = ({url}: {url: string}) => {
  return (
    <div className="sm:hover:scale-105 sm:transition-all sm:duration-300 flex justify-center items-center my-4">
      <Image 
      src={(url && url) || ""}
      alt="image is processing"
      width={300}
      height={300}
      className="rounded-md object-contain"
      />
    </div>
  )
}

export default CardImage