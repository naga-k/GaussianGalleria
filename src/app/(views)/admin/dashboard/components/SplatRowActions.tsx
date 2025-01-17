'use client';
interface SplatRowActionsProps {
  id: number;
}

const SplatRowActions = ({ id }: SplatRowActionsProps) => {
  const handleEdit = async () => {
    // TODO: API call to edit
    console.log('Edit splat:', id);
  };

  const handleDelete = async () => {
    // TODO: API call to delete
    console.log('Delete splat:', id);
  };

  const handleViewSplat = () => {
    // TODO: Navigate to splat view
    window.open(`/viewer?id=${id}`, '_blank');
  };

  const handleViewVideo = () => {
    window.open(`/admin/dashboard/videoPreview?id=${id}`, '_blank');
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleEdit}
        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Edit Details
      </button>
      <button
        onClick={handleDelete}
        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete
      </button>
      <button
        onClick={handleViewSplat}
        className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
      >
        View Splat
      </button>
      <button
        onClick={handleViewVideo}
        className="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        View Video
      </button>
    </div>
  );
};

export default SplatRowActions;