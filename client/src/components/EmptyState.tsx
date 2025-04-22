import { useGallery } from "../context/GalleryContext";

const EmptyState = () => {
  const { openModal } = useGallery();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="text-6xl mb-4 text-[#FF6B8B]/70">
        <i className="fas fa-heart-broken"></i>
      </div>
      <h2 className="text-2xl font-['Playfair_Display'] font-semibold mb-2 text-[#FF6B8B]">Belum ada momen tersimpan</h2>
      <p className="text-gray-600 max-w-md mb-8">Yuk, mulai abadikan momen-momen indah kalian dengan menambahkan kenangan pertama!</p>
      <button 
        className="bg-gradient-to-r from-[#FF6B8B] to-[#FF8FA3] text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transform transition hover:-translate-y-1"
        onClick={openModal}
      >
        <i className="fas fa-plus mr-2"></i> Tambah Momen Pertama
      </button>
    </div>
  );
};

export default EmptyState;
