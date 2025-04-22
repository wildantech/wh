import { useState, useEffect } from "react";
import { Memory } from "../types";
import { useGallery } from "../context/GalleryContext";

interface MemoryCardProps {
  memory: Memory;
  index: number;
}

const MemoryCard = ({ memory, index }: MemoryCardProps) => {
  const [visible, setVisible] = useState(false);
  const { deleteMemory } = useGallery();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, index * 150);

    return () => clearTimeout(timer);
  }, [index]);

  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus momen ini?')) {
      deleteMemory(memory.id);
    }
  };

  return (
    <div 
      className={`rounded-lg bg-white overflow-hidden shadow-md transition-opacity duration-800 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        boxShadow: "0 4px 15px rgba(255, 107, 139, 0.2)",
      }}
    >
      <div className="h-48 md:h-56 overflow-hidden bg-[#FFE5EB] relative">
        <img 
          src={memory.image} 
          alt={memory.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
        />
      </div>
      <div className="p-4">
        <h3 className="font-['Playfair_Display'] text-xl font-semibold mb-2">{memory.title}</h3>
        <p className="text-gray-600 text-sm">{memory.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-gray-500">{memory.date}</span>
          <button 
            className="text-gray-400 hover:text-[#FF4365] transition" 
            onClick={handleDelete}
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoryCard;
