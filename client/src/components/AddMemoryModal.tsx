import { useState, useRef, FormEvent, ChangeEvent } from "react";
import { useGallery } from "../context/GalleryContext";

const AddMemoryModal = () => {
  const { isModalOpen, closeModal, addMemory, selectedImage, setSelectedImage, imagePreview, setImagePreview } = useGallery();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetImageUpload = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!title || !imagePreview) {
      alert("Judul dan foto tidak boleh kosong");
      return;
    }

    addMemory({
      title,
      description,
      image: imagePreview,
    });
    
    // Reset form
    setTitle("");
    setDescription("");
    resetImageUpload();
    closeModal();
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
      <div 
        className="absolute inset-0" 
        onClick={closeModal}
      ></div>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10 animate-fade-in overflow-hidden">
        <div className="bg-gradient-to-r from-[#FF6B8B] to-[#FF8FA3] py-4 px-6">
          <h3 className="text-white font-['Playfair_Display'] text-xl font-semibold">Tambah Momen Baru</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-5">
            <label htmlFor="memory-title" className="block text-gray-700 font-medium mb-2">Judul Momen</label>
            <input 
              type="text" 
              id="memory-title" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B8B] focus:border-transparent"
              placeholder="Contoh: Liburan di Bali"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-5">
            <label htmlFor="memory-description" className="block text-gray-700 font-medium mb-2">Deskripsi Singkat</label>
            <textarea 
              id="memory-description" 
              rows={3} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B8B] focus:border-transparent"
              placeholder="Ceritakan momen spesial ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">Unggah Foto</label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#FF6B8B] transition cursor-pointer">
              <input 
                type="file" 
                id="memory-image" 
                ref={fileInputRef}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                accept="image/*" 
                onChange={handleImageChange}
                required
              />
              {!imagePreview ? (
                <div>
                  <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                  <p className="text-gray-500">Klik atau seret foto ke sini</p>
                </div>
              ) : (
                <div>
                  <img src={imagePreview} alt="Preview" className="mx-auto max-h-48 rounded" />
                  <button 
                    type="button" 
                    className="mt-2 text-[#FF6B8B] hover:underline text-sm"
                    onClick={resetImageUpload}
                  >
                    Ganti Foto
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              type="button" 
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              onClick={closeModal}
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-gradient-to-r from-[#FF6B8B] to-[#FF8FA3] text-white rounded-lg hover:shadow-md transition"
            >
              Simpan Momen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemoryModal;
