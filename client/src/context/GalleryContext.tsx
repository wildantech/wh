import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Memory } from '../types';
import { sampleMemories } from '../utils/sampleData';

// Define the shape of our context
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

// Create a context with a default value
const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

// Provider component
export function GalleryProvider({ children }: { children: ReactNode }) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(70);

  // Load memories from localStorage on component mount
  useEffect(() => {
    loadMemoriesFromStorage();
  }, []);

  // Functions for context
  const loadMemoriesFromStorage = () => {
    try {
      const savedMemories = localStorage.getItem('loveMemories');
      if (savedMemories) {
        setMemories(JSON.parse(savedMemories));
      } else {
        // Use sample data for first-time visitors
        setMemories(sampleMemories);
        localStorage.setItem('loveMemories', JSON.stringify(sampleMemories));
      }
    } catch (error) {
      console.error('Error loading memories from storage:', error);
      setMemories(sampleMemories);
    }
  };

  const saveMemoriesToStorage = () => {
    try {
      localStorage.setItem('loveMemories', JSON.stringify(memories));
    } catch (error) {
      console.error('Error saving memories to storage:', error);
    }
  };

  const addMemory = (memoryData: Omit<Memory, 'id' | 'date'>) => {
    const newMemory: Memory = {
      id: Date.now(),
      ...memoryData,
      date: new Date().toISOString().split('T')[0],
    };

    setMemories((prevMemories) => {
      const updatedMemories = [newMemory, ...prevMemories];
      try {
        localStorage.setItem('loveMemories', JSON.stringify(updatedMemories));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      return updatedMemories;
    });
  };

  const deleteMemory = (id: number) => {
    setMemories((prevMemories) => {
      const updatedMemories = prevMemories.filter(memory => memory.id !== id);
      try {
        localStorage.setItem('loveMemories', JSON.stringify(updatedMemories));
      } catch (error) {
        console.error('Error saving to localStorage after delete:', error);
      }
      return updatedMemories;
    });
  };

  const openModal = () => setIsModalOpen(true);
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const toggleMusic = () => setMusicPlaying(prev => !prev);

  // Value object that will be provided to consumers
  const value = {
    memories,
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

// Custom hook to consume the context
export function useGallery() {
  const context = useContext(GalleryContext);
  
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  
  return context;
}
