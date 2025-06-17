import {
  useDeleteHomeControlMutation,
  useGetHomeControlsQuery,
  useUpdateSelectionMutation,
} from "../../redux/features/allApis/homeControlApi/homeControlApi";
import { useState } from "react";
import { deleteImage } from "../../hooks/files";
import DeleteModal from "../modals/DeleteModal";
import toast from "react-hot-toast";

const LogoSelection = () => {
  const { data: homeControls, refetch } = useGetHomeControlsQuery();
  const [deleteHomeControl] = useDeleteHomeControlMutation();
  const [item, setItem] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [updateSelection] = useUpdateSelectionMutation();

  const logoHomeControls = homeControls?.filter(
    (control) => control.category === "logo"
  );

  const handleDeleteButtonClick = (item) => {
    setItem(item);
    setIsOpen(true);
  };

  const handleDelete = async () => {
    try {
      const { message } = await deleteImage(item?.image);
      if (message) {
        try {
          const result = await deleteHomeControl(item?._id);
          if (result.data.deletedCount > 0) {
            toast.success("Logo deleted successfully");
            refetch();
            setIsOpen(false);
          }
          // eslint-disable-next-line no-unused-vars
        } catch (error) {
          toast.error("Failed to delete logo");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckboxChange = async (id) => {
    try {
      const result = await updateSelection(id);
      if (result.data) {
        toast.success(result.data.message);
      }
      refetch();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
        {logoHomeControls?.map((control) => (
          <div
            className="relative border border-[#14805e] p-2"
            key={control._id}
          >
            <img
              className="w-full h-full rounded-md"
              src={`${import.meta.env.VITE_BASE_API_URL}${control.image}`}
              alt=""
            />

            <input
              checked={control?.isSelected === true}
              className="absolute top-0 left-0 w-4 lg:w-5 h-4"
              type="checkbox"
              name=""
              onChange={() => handleCheckboxChange(control._id)}
              id={control?._id}
            />

            <button onClick={() => handleDeleteButtonClick(control)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className=" absolute top-0 right-0 w-5 lg:w-5 h-4 text-white  bg-red-500 hover:bg-red-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <DeleteModal
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        handleDelete={handleDelete}
      ></DeleteModal>
    </>
  );
};

export default LogoSelection;
