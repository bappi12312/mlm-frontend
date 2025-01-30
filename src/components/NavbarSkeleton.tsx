export default function NavbarSkeleton() {
  return (
    <div className="h-16 bg-gray-100 animate-pulse">
      <div className="container mx-auto flex items-center h-full px-4">
        <div className="w-32 h-8 bg-gray-300 rounded" />
        <div className="flex-1 flex justify-end space-x-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-20 h-6 bg-gray-300 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}