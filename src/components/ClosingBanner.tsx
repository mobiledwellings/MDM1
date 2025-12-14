const image_a85d8fbd754907a0b33d155d1a9cf0e8a2455df9 = "https://images.unsplash.com/photo-1720325835679-29fbefe864ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBidXMlMjBjb252ZXJzaW9uJTIwaW50ZXJpb3IlMjBjb3p5fGVufDF8fHx8MTc2NTMyODI3N3ww&ixlib=rb-4.1.0&q=80&w=1080";
const bannerImage = "https://images.unsplash.com/photo-1705601456582-7177f3868f8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aWRlJTIwbGFuZHNjYXBlJTIwc2Nob29sJTIwYnVzJTIwY29udmVyc2lvbnxlbnwxfHx8fDE3NjUzMjgyOTF8MA&ixlib=rb-4.1.0&q=80&w=1080";

export function ClosingBanner() {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full lg:max-w-7xl lg:px-6">
        <div className="relative w-full h-[200px] md:h-[280px] lg:h-[320px] overflow-hidden lg:rounded-lg">
          {/* Mobile banner */}
          <img
            src={image_a85d8fbd754907a0b33d155d1a9cf0e8a2455df9}
            alt="If you build it / You can go"
            className="w-full h-full object-cover object-center md:hidden"
          />
          {/* Desktop banner */}
          <img
            src={bannerImage}
            alt="If you build it / You can go"
            className="w-full h-full object-cover object-center hidden md:block"
          />
        </div>
      </div>
    </div>
  );
}
