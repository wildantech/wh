import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

export default function MuseumEntrance() {
  const [, setLocation] = useLocation();
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [partnerPhoto, setPartnerPhoto] = useState<string | null>(null);

  // Load photos from localStorage or use default
  useEffect(() => {
    const savedUserPhoto = localStorage.getItem('userPhoto');
    const savedPartnerPhoto = localStorage.getItem('partnerPhoto');

    if (savedUserPhoto) {
      setUserPhoto(savedUserPhoto);
    } else {
      setUserPhoto('images/1656333876974.jpeg');
    }
    
    if (savedPartnerPhoto) {
      setPartnerPhoto(savedPartnerPhoto);
    } else {
      setPartnerPhoto('images/1691753711833.jpg');
    }
  }, []);

  // Save photos to localStorage when they change
  useEffect(() => {
    if (userPhoto) localStorage.setItem('userPhoto', userPhoto);
    if (partnerPhoto) localStorage.setItem('partnerPhoto', partnerPhoto);
  }, [userPhoto, partnerPhoto]);

  // Auto redirect after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation('/gallery');
    }, 3000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  // Background music setup
  useEffect(() => {
    const audio = new Audio('/music/background.mp3');
    audio.loop = true;
    audio.play().catch(err => console.log('Audio autoplay prevented'));
    
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const handleUserPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePartnerPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPartnerPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#121212] to-[#181818] text-white">
      <div className="w-full max-w-4xl relative">
        <div className="w-full aspect-[16/9] bg-[#282828] rounded-t-3xl shadow-2xl p-4 sm:p-6 md:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1DB954]/30 to-transparent opacity-70 z-10"></div>

          {/* Nama Museum di Bagian Atas */}
          <div className="absolute top-2 md:top-4 left-0 right-0 text-center z-30">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white drop-shadow-lg px-2">
              Museum Kenangan Cinta
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-gray-200 italic mt-1 md:mt-2 px-2">
              Koleksi Momen-Momen Abadi Kisah Cinta Kita
            </p>
          </div>

          {/* Area untuk menambah foto Anda dan pasangan */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center z-20">
            <div className="flex -space-x-2 sm:-space-x-4">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-2 sm:border-4 border-[#1DB954] overflow-hidden bg-[#181818] flex items-center justify-center shadow-lg shadow-[#1DB954]/20 relative group">
                {userPhoto ? (
                  <img src={userPhoto} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs sm:text-sm text-center text-gray-400 p-1">
                    Foto Anda
                  </span>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                  <span className="text-xs text-white mb-1">{userPhoto ? 'Ubah' : 'Tambah'}</span>
                  <label className="px-2 py-1 bg-[#1DB954] text-white text-xs rounded-full cursor-pointer">
                    Pilih
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleUserPhotoChange}
                    />
                  </label>
                </div>
              </div>
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-2 sm:border-4 border-[#1DB954] overflow-hidden bg-[#181818] flex items-center justify-center shadow-lg shadow-[#1DB954]/20 relative group">
                {partnerPhoto ? (
                  <img src={partnerPhoto} alt="Partner" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs sm:text-sm text-center text-gray-400 p-1">
                    Foto pasangan
                  </span>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                  <span className="text-xs text-white mb-1">{partnerPhoto ? 'Ubah' : 'Tambah'}</span>
                  <label className="px-2 py-1 bg-[#1DB954] text-white text-xs rounded-full cursor-pointer">
                    Pilih
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handlePartnerPhotoChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Efek Kilau */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-5 z-30"></div>
        </div>
        
        {/* Tangga Museum */}
        <div className="h-20 bg-gradient-to-b from-[#1DB954] to-[#121212] relative z-0">
          <div className="h-1/3 bg-[#1a9e48]"></div>
          <div className="h-1/3 bg-[#158538]"></div>
          <div className="h-1/3 bg-[#0f6d2c]"></div>
        </div>
      </div>
    </div>
  );
}