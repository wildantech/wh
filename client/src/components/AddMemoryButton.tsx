import { useGallery } from "../context/GalleryContext";

const AddMemoryButton = () => {
  const { openModal } = useGallery();

  return (
    <div className="fixed bottom-24 right-6 z-20">
      <button 
        className="bg-gradient-to-r from-[#FF6B8B] to-[#FF8FA3] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transform transition hover:-translate-y-1"
        onClick={openModal}
      >
        <i className="fas fa-plus text-xl"></i>
      </button>
    </div>
  );
};

export default AddMemoryButton;
