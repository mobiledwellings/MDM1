import bannerImage from "@/assets/placeholders/banner-placeholder.jpg";
import bannerImageMobile from "@/assets/placeholders/banner-placeholder-mobile.jpg";

export function ClosingBanner() {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full lg:max-w-7xl lg:px-6">
        <div className="relative w-full h-[200px] md:h-[280px] lg:h-[320px] overflow-hidden lg:rounded-lg">
          {/* Mobile banner */}
          <img
            src={bannerImageMobile}
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