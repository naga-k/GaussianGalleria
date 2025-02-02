"use client";
interface TableRowActionsProps {
  id: number;
  type: string;
  editCallback: (id: number) => void;
  deleteCallback: (id: number) => void;
}

const TableRowActions = ({
  id,
  type,
  editCallback,
  deleteCallback,
}: TableRowActionsProps) => {
  const handleEdit = async () => {
    editCallback(id);
  };

  const handleDelete = async () => {
    deleteCallback(id);
  };

  const handleViewSplat = () => {
    window.open(`/viewer?id=${id}`, "_blank");
  };

  const handleViewVideo = () => {
    window.open(`/admin/dashboard/videoPreview?id=${id}`, "_blank");
  };

  return (
    <div className="w-fit flex gap-2">
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
      {type === "splat" && (
        <>
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
        </>
      )}
    </div>
  );
};

export default TableRowActions;
