// src/components/modals/EditGameModal.jsx
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { uploadImage } from "../../hooks/files";
import { useUpdateGameMutation } from "../../redux/features/allApis/gameApi/gameApi";
import SpinLoader from "../loaders/SpinLoader";

const EditGameModal = ({ isOpen, closeModal, game, refetch }) => {
  const [updateGame, { isLoading }] = useUpdateGameMutation();
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    api: "",
    column: 1,
    image: null,
    previewImage: "",
  });

  const apis = [
    { value: "sports-live-tv", label: "Sports Live TV" },
    { value: "kambi", label: "Kambi" },
    { value: "playtech", label: "Playtech" },
    { value: "betfair", label: "BetFair" },
    { value: "pinnacle", label: "Pinnacle" },
    { value: "etent", label: "Etent" },
    { value: "sports-radar", label: "Sports Radar" },
    { value: "softswiss", label: "SoftSwiss" },
    { value: "saba-sports", label: "SABA Sports" },
    { value: "odds-jam", label: "Odds Jam" },
    { value: "evolution", label: "Evolution" },
    { value: "obs", label: "OBS" },
    { value: "bet-construct", label: "Bet Construct" },
    { value: "pragmatic-play", label: "Pragmatic Play" },
    { value: "in-sports", label: "In Sports" },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    if (game) {
      setFormData({
        title: game.title,
        link: game.link,
        api: game.api || "",
        column: parseInt(game.column) || 1,
        image: null,
        previewImage: game.image,
      });
    }
  }, [game]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        previewImage: URL.createObjectURL(file),
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      previewImage: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.previewImage;

      // Upload new image if selected
      if (formData.image) {
        const { filePath } = await uploadImage(formData.image);
        imageUrl = filePath;
      }

      const gameInfo = {
        id: game._id,
        data: {
          title: formData.title,
          link: formData.link,
          api: formData.api,
          column: formData.column,
          image: imageUrl,
        },
      };

      const result = await updateGame(gameInfo);

      if (result.data?.modifiedCount > 0) {
        toast.success("Game updated successfully");
        refetch();
        closeModal();
      } else if (result.error) {
        toast.error(result.error.data.error);
      }
    } catch (error) {
      toast.error("Failed to update game");
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Game</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Game Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Game Link
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Game API
            </label>
            <select
              name="api"
              value={formData.api}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border rounded-md"
              required
            >
              <option value="">Select an API</option>
              {apis.map((api) => (
                <option key={api.value} value={api.value}>
                  {api.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Set Width (Column)
            </label>
            <select
              name="column"
              value={formData.column}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border rounded-md"
              required
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
            <label className="block text-gray-700 font-medium mb-2">
              Game Image
            </label>
            {!formData.previewImage ? (
              <label className="w-full flex flex-col items-center text-center cursor-pointer">
                <div className="text-gray-400 text-4xl mb-2">📤</div>
                <p className="text-gray-600 font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-gray-400 text-sm">
                  Only image files are allowed
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            ) : (
              <div className="flex flex-col items-center">
                <img
                  src={
                    formData.image
                      ? formData.previewImage
                      : `${import.meta.env.VITE_BASE_API_URL}${
                          formData.previewImage
                        }`
                  }
                  alt="Preview"
                  className="w-full h-auto max-h-48 object-contain rounded-md mb-3"
                />
                <div className="flex gap-2">
                  <label className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-1.5 bg-gray-300 rounded-md hover:bg-gray-400"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? <SpinLoader /> : "Update Game"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGameModal;
