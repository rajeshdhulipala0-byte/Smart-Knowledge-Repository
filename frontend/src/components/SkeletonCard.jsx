const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded skeleton w-3/4"></div>

        {/* Content lines */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded skeleton"></div>
          <div className="h-4 bg-gray-200 rounded skeleton"></div>
          <div className="h-4 bg-gray-200 rounded skeleton w-5/6"></div>
        </div>

        {/* Tags */}
        <div className="flex space-x-2">
          <div className="h-6 bg-gray-200 rounded skeleton w-16"></div>
          <div className="h-6 bg-gray-200 rounded skeleton w-20"></div>
          <div className="h-6 bg-gray-200 rounded skeleton w-16"></div>
        </div>

        {/* Footer */}
        <div className="flex justify-between pt-4">
          <div className="h-4 bg-gray-200 rounded skeleton w-24"></div>
          <div className="h-4 bg-gray-200 rounded skeleton w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
