import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Memory } from './types';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider, useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// TYPE DEFINITIONS
interface GalleryContextType {
  memories: Memory[];
  isModalOpen: boolean;
  selectedImage: File | null;
  imagePreview: string | null;
  musicPlaying: boolean;
  volume: number;
  loadMemoriesFromStorage: () => void;
  saveMemoriesToStorage: () => void;
  addMemory: (memory: Omit<Memory, 'id' | 'date'>) => void;
  deleteMemory: (id: number) => void;
  openModal: () => void;
  closeModal: () => void;
  setSelectedImage: (file: File | null) => void;
  setImagePreview: (preview: string | null) => void;
  toggleMusic: () => void;
  setVolume: (volume: number) => void;
}

// CONTEXT SETUP
const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export function useGallery() {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
}

// GALLERY PROVIDER
export function GalleryProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const { toast } = useToast();
  
  // Query untuk mendapatkan semua kenangan dari API
  const { data: memories = [], isLoading } = useQuery({
    queryKey: ['/api/memories'],
    queryFn: async ({ queryKey }) => {
      try {
        const response = await fetch(queryKey[0] as string);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return await response.json() as Memory[];
      } catch (error) {
        console.error('Error fetching memories:', error);
        return [] as Memory[];
      }
    }
  });

  // Mutation untuk menambahkan kenangan baru
  const addMemoryMutation = useMutation({
    mutationFn: async (memoryData: Omit<Memory, 'id' | 'date'>) => {
      // Tambahkan tanggal saat ini
      const memoryWithDate = {
        ...memoryData,
        date: new Date().toISOString().split('T')[0],
      };
      
      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memoryWithDate),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add memory');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      // Invalidate query untuk mendapatkan data terbaru
      queryClient.invalidateQueries({ queryKey: ['/api/memories'] });
      toast({
        title: "Berhasil",
        description: "Kenangan telah ditambahkan dengan sukses",
      });
    },
    onError: (error) => {
      console.error('Error adding memory:', error);
      toast({
        title: "Gagal menambahkan kenangan",
        description: "Terjadi kesalahan saat menyimpan kenangan Anda",
        variant: "destructive",
      });
    }
  });

  // Mutation untuk menghapus kenangan
  const deleteMemoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/memories/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete memory');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      // Invalidate query untuk mendapatkan data terbaru
      queryClient.invalidateQueries({ queryKey: ['/api/memories'] });
      toast({
        title: "Berhasil",
        description: "Kenangan telah dihapus",
      });
    },
    onError: (error) => {
      console.error('Error deleting memory:', error);
      toast({
        title: "Gagal menghapus kenangan",
        description: "Terjadi kesalahan saat menghapus kenangan",
        variant: "destructive",
      });
    }
  });

  // Fungsi-fungsi
  const loadMemoriesFromStorage = () => {
    // Sekarang kita menggunakan React Query untuk mendapatkan data
    queryClient.invalidateQueries({ queryKey: ['/api/memories'] });
  };

  const saveMemoriesToStorage = () => {
    // Fungsi ini tetap ada untuk kompatibilitas dengan kode lama
    // tapi tidak lagi melakukan apa-apa karena data di-persist ke database
  };

  const addMemory = (memoryData: Omit<Memory, 'id' | 'date'>) => {
    addMemoryMutation.mutate(memoryData);
  };

  const deleteMemory = (id: number) => {
    deleteMemoryMutation.mutate(id);
  };

  const openModal = () => setIsModalOpen(true);
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const toggleMusic = () => setMusicPlaying(prev => !prev);

  const value: GalleryContextType = {
    memories: memories as Memory[],
    isModalOpen,
    selectedImage,
    imagePreview,
    musicPlaying,
    volume,
    loadMemoriesFromStorage,
    saveMemoriesToStorage,
    addMemory,
    deleteMemory,
    openModal,
    closeModal,
    setSelectedImage,
    setImagePreview,
    toggleMusic,
    setVolume
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
}

// HEADER COMPONENT
export function Header() {
  return (
    <header className="py-6 bg-gradient-to-r from-[#1DB954] to-[#191414] text-white shadow-md">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center">Museum Kenangan Cinta</h1>
        <p className="text-center mt-2 text-gray-200 italic">Koleksi momen-momen abadi kisah cinta kita</p>
      </div>
    </header>
  );
}

// MEMORY CARD COMPONENT
export function MemoryCard({ memory, index }: { memory: Memory; index: number }) {
  const { deleteMemory } = useGallery();
  
  return (
    <div 
      className="bg-[#282828] text-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 card-fade-in hover-glow"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="h-64 overflow-hidden">
        <img 
          src={memory.image} 
          alt={memory.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-5 bg-gradient-to-b from-[#282828] to-[#181818]">
        <h3 className="text-xl font-semibold text-white mb-2">{memory.title}</h3>
        <p className="text-gray-300 mb-3">{memory.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">{memory.date}</span>
          <button 
            onClick={() => deleteMemory(memory.id)}
            className="text-[#1DB954] hover:text-white transition-colors"
            aria-label="Hapus kenangan"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// GALLERY CONTAINER COMPONENT
export function GalleryContainer() {
  const { memories } = useGallery();

  if (memories.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {memories.map((memory, index) => (
        <MemoryCard key={memory.id} memory={memory} index={index} />
      ))}
    </div>
  );
}

// EMPTY STATE COMPONENT
export function EmptyState() {
  const { openModal } = useGallery();
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-[#282828] rounded-lg p-8 text-center shadow-md">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#1DB954] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <h3 className="text-xl font-medium text-white mb-2">Belum ada kenangan yang tersimpan</h3>
      <p className="text-gray-400 mb-4">Mulai membuat koleksi kenangan cinta Anda sekarang!</p>
      <button 
        onClick={openModal}
        className="px-4 py-2 bg-[#1DB954] text-white rounded-md hover:bg-[#1ed760] transition-colors hover-glow"
      >
        Tambahkan Kenangan
      </button>
    </div>
  );
}

// ADD MEMORY BUTTON COMPONENT
export function AddMemoryButton() {
  const { openModal } = useGallery();
  return (
    <button 
      onClick={openModal}
      className="fixed right-8 bottom-24 w-14 h-14 rounded-full bg-[#1DB954] text-white shadow-lg flex items-center justify-center hover:bg-[#1ed760] transition-colors z-10 hover-glow"
      aria-label="Tambah kenangan baru"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
}

// ADD MEMORY MODAL COMPONENT
export function AddMemoryModal() {
  const { 
    isModalOpen, 
    closeModal, 
    addMemory, 
    selectedImage, 
    setSelectedImage,
    imagePreview,
    setImagePreview
  } = useGallery();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !imagePreview) return;
    
    addMemory({
      title,
      description,
      image: imagePreview,
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setSelectedImage(null);
    setImagePreview(null);
    closeModal();
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-[#282828] rounded-lg shadow-xl w-full max-w-md overflow-hidden text-white">
        <div className="bg-gradient-to-r from-[#1DB954] to-[#191414] px-6 py-4 text-white">
          <h2 className="text-xl font-bold">Tambah Kenangan Baru</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-white font-medium mb-2" htmlFor="title">
              Judul Kenangan
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#181818] border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
              placeholder="Contoh: Pertama Kali Bertemu"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-white font-medium mb-2" htmlFor="description">
              Deskripsi
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#181818] border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DB954] min-h-[100px]"
              placeholder="Ceritakan momen spesial ini..."
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-white font-medium mb-2">
              Foto Kenangan
            </label>
            <div className="relative border-2 border-dashed border-gray-700 rounded-md p-4 text-center hover:border-[#1DB954] transition-colors bg-[#181818]">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto max-h-48 rounded"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-[#282828] text-white rounded-full p-1 hover:bg-[#1DB954] transition-colors"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-[#1DB954]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-400">Klik untuk memilih foto</p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${imagePreview ? 'hidden' : ''}`}
                required={!imagePreview}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-700 text-gray-200 rounded-md hover:bg-[#181818] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1DB954] text-white rounded-md hover:bg-[#1ed760] transition-colors hover-glow"
              disabled={!title || !description || !imagePreview}
            >
              Simpan Kenangan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// MUSIC PLAYER COMPONENT
export function MusicPlayer() {
  const { musicPlaying, toggleMusic, volume, setVolume } = useGallery();
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (musicPlaying) {
        audioRef.current.play().catch(err => {
          console.error("Audio play failed:", err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [musicPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-[#282828] text-white p-3 shadow-lg z-20">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleMusic}
            className="p-2 rounded-full hover:bg-[#1DB954] hover:text-black transition-colors"
            aria-label={musicPlaying ? "Pause music" : "Play music"}
          >
            {musicPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          <div className="ml-3">
            <div className="text-sm font-medium">Lagu Romantis</div>
            <div className="text-xs text-gray-400">Musik latar museum kenangan</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 w-1/3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#1DB954]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414-5.658m-2.828 9.9a9 9 0 010-12.728" />
          </svg>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="w-full h-1.5 bg-[#535353] rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1DB954]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414-5.658m-2.828 9.9a9 9 0 010-12.728" />
          </svg>
        </div>
        
        <audio
          ref={audioRef}
          loop
          src="https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff5de4.mp3?filename=soft-piano-100-bpm-121529.mp3"
        />
      </div>
    </div>
  );
}

// GALLERY APP COMPONENT
export function GalleryApp() {
  return (
    <div className="min-h-screen" style={{
      backgroundColor: "#121212",
      backgroundImage: "radial-gradient(#333333 0.5px, transparent 0.5px)",
      backgroundSize: "15px 15px",
    }}>
      <Header />
      <main className="container mx-auto px-4 py-8 pb-24">
        <GalleryContainer />
        <AddMemoryButton />
        <AddMemoryModal />
      </main>
      <MusicPlayer />
    </div>
  );
}

// ROOT COMPONENT WITH PROVIDERS
export default function GalleryRoot() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GalleryProvider>
          <GalleryApp />
          <Toaster />
        </GalleryProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}