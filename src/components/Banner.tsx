"use client";

import Slider from "react-slick";
import { Button } from "./ui/button";
import Image from "next/image";

interface HeroItem {
  id: number;
  img: string;
  subtitle: string;
  title: string;
  title2: string;
}

const heroSide: HeroItem[] = [
  {
    id: 1,
    img: "https://imgs.search.brave.com/AZkKYOifhfns8OmMQcTUfP9YTKWXy4N2vwDbbzYEV9U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy9i/L2I2L1BlbmNpbF9k/cmF3aW5nX29mX2Ff/Z2lybF9pbl9lY3N0/YXN5LmpwZw",
    subtitle: "Wireless",
    title: "For Sale",
    title2: "Headphone",
  },
  {
    id: 2,
    img: "https://imgs.search.brave.com/ZiA5Qh_GYUgaXdNF0S4tjSZdeKhXcmJnI0VUt4giRI8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vcGljanVt/Ym8uY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy9zaWxob3VldHRl/LW9mLWEtZ3V5LXdp/dGgtYS1jYXAtYXQt/cmVkLXNreS1zdW5z/ZXQtZnJlZS1pbWFn/ZS5qcGVnP2g9ODAw/JnF1YWxpdHk9ODA",
    subtitle: "Wireless",
    title: "For Sale",
    title2: "Headphone",
  },
];

const Banner = () => {
  const settings = {
    dots: false,
    arrows: false,
    speed: 800,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "ease-in-out",
  };

  return (
    <div className="container">
      <div className="overflow-hidden rounded-3xl min-h-[550px] sm:min-h-[650px] hero-bg-color flex justify-center items-center">
        <div className="container pb-8 sm:pb-0">
          <Slider {...settings}>
            {heroSide.map((item) => (
              <div key={item.id}>
                <div className="grid grid-cols-1 sm:grid-cols-2 overflow-hidden gap-3 sm:gap-0 relative">
                  <div className="flex flex-col justify-center gap-4 sm:pl-3 pt-12 sm:pt-0 text-center sm:text-left relative z-10">
                    <h1 className="text-2xl sm:text-6xl lg:text-2xl font-bold">{item.subtitle}</h1>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold">{item.title}</h1>
                    <h1 className="text-5xl uppercase text-white sm:text-[80px] font-bold md:text-[100px] lg:text-[150px]">
                      {item.title2}
                    </h1>
                    <div>
                      <Button variant={"destructive"}>Button</Button>
                    </div>
                  </div>
                  <div className="order-1 sm:order-2 relative">
                    <Image
                      src={item.img}
                      alt="img"
                      width={300}
                      height={300}
                      className="w-[300px] h-[300px] object-contain sm:h-[450px] sm:scale-105 lg:scale-110 mx-auto drop-shadow-[-8px_4px_6px_rgba(0,0,0,-4)] relative z-40"
                    />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Banner;
