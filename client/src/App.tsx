import { useEffect } from "react";
import Header from "./components/Header";
import GalleryContainer from "./components/GalleryContainer";
import AddMemoryButton from "./components/AddMemoryButton";
import AddMemoryModal from "./components/AddMemoryModal";
import MusicPlayer from "./components/MusicPlayer";
import { useGallery } from "./context/GalleryContext";

export default function App() {
  const { loadMemoriesFromStorage } = useGallery();
  
  // Load memories from storage when the app first renders
  useEffect(() => {
    loadMemoriesFromStorage();
  }, [loadMemoriesFromStorage]);

  return (
    <div className="min-h-screen" style={{
      backgroundColor: "#FFF5F7",
      backgroundImage: "radial-gradient(#FFD6DE 0.5px, transparent 0.5px)",
      backgroundSize: "15px 15px",
    }}>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <GalleryContainer />
        <AddMemoryButton />
        <AddMemoryModal />
      </main>
      <MusicPlayer />
    </div>
  );
}
