import Carousel from "@/components/Carousel";
import Categories from "@/components/Categories";
import FlashSales from "@/components/FlashSales";
import LeftSideHero from "@/components/LeftSideHero";
import Image from "next/image";

export default function Home() {
  const OPTIONS = {};
  const SLIDE_COUNT = 4;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());
  return (
    <div className="">
      <div className=" h-[70vh] py-16 relative">
        {/* <Categories /> */}
        {/* <img src="/2.png" className="absolute inset-0 w-full object-contain" alt="" /> */}
        <Carousel slides={SLIDES} options={OPTIONS} />
      </div>
      <FlashSales />
    </div>
  );
}
