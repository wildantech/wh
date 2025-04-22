const Header = () => {
  return (
    <header className="bg-gradient-to-r from-[#FF6B8B] to-[#FF8FA3] py-6 px-4 shadow-md">
      <div className="container mx-auto text-center">
        <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white mb-2">
          Galeri Momen Kita
        </h1>
        <p className="text-white/90 text-lg italic font-light">Mengabadikan kenangan indah bersama</p>
        <div className="flex justify-center mt-3">
          <i className="fas fa-heart text-white/80 text-xl heart-pulse"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
