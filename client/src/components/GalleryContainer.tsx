import { useGallery } from "../context/GalleryContext";
import MemoryCard from "./MemoryCard";
import EmptyState from "./EmptyState";

const GalleryContainer = () => {
  const { memories } = useGallery();

  if (memories.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="mb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories.map((memory, index) => (
          <MemoryCard key={memory.id} memory={memory} index={index} />
        ))}
      </div>
    </div>
  );
};

export default GalleryContainer;
