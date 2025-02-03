
type ListType = {
  title: string;
  data: number;
  color: string;
};
const List = ({title,data, color}:ListType) => {
  return (
    <>
      <div className={`flex flex-col gap-2 w-60 h-auto p-5  rounded ${color}`}>
      <h1  
      className="text-xl font-bold items-start justify-start text-white "
      >{title}</h1>
      <p className="text-xl font-bold items-center justify-center">{data}</p>
      </div>
    </>
  )
}

export default List