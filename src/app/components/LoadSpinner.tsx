interface LoadSpinnerProps {
  progress?: number;
}

export default function LoadSpinner({ progress }: LoadSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex justify-center items-center h-fit">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
      
      {progress !== undefined && (
        <>
          <div className="w-64 bg-gray-200 rounded-full h-2.5 mt-4">
            <div 
              className="bg-teal-500 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">{progress}% completed</p>
        </>
      )}
    </div>
  );
}