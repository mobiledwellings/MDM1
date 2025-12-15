import bannerImage from "@/assets/banners/closing-banner.jpg";

export function ClosingBanner() {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full lg:max-w-7xl lg:px-6">
        <div className="relative w-full h-[200px] md:h-[280px] lg:h-[320px] overflow-hidden lg:rounded-lg">
          <img
            src={bannerImage}
            alt="If you build it, you can go"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
}