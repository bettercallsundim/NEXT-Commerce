"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";
import LeftSideHero from "./LeftSideHero";
const imaged = [
  {
    original:
      "https://sneakernews.com/wp-content/uploads/2024/06/black-cement-jordan-3-2024.jpg",
    thumbnail: "https://picsum.photos/id/1018/250/150/",
  },
  {
    original: "https://sneakerpimpbd.co/content/images/thumbs/0003654.png",
    thumbnail: "https://picsum.photos/id/1015/250/150/",
  },
  {
    original:
      "https://hips.hearstapps.com/hmg-prod/images/sneaker-brands-1588881434.png?crop=0.8930232558139535xw:1xh;center,top&resize=1200:*",
    thumbnail: "https://picsum.photos/id/1019/250/150/",
  },
];

export const images = imaged.map((itm) => itm.original);

const imageByIndex = (index) => images[index % images.length];

const Carousel = (props) => {
  const { slides, options } = props;
  const autoplay = useRef(
    Autoplay(
      { delay: 3000, stopOnInteraction: false },
      /* @ts-ignore */

      (emblaRoot) => emblaRoot.parentElement
    )
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [autoplay.current]);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );
  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onInit = useCallback((emblaApi) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  return (
    <div className="flex  flex-col xl:flex-row h-full items-center justify-between z-10 mt-10">
      <div className="space-y-2 w-[22%] flex flex-col items-center">
        {/* <div className="w-full aspect-square rounded-md ">
          <img
            src="https://s.yimg.com/ny/api/res/1.2/nyIWjM3dPmR3siXl3uZYpg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD04MDA-/https://s.yimg.com/os/creatr-uploaded-images/2023-09/4ecf38c0-4bf8-11ee-beee-ff41b131ea04"
            alt=""
            className="w-full h-full rounded-md object-cover"
          />
        </div> */}
        <div className="mb-2">
          <span className="text-[50px] font-bold text-gray-950 bg-cyan-500 rounded-md px-4 py-2 inline-block">
            NEXT Commerce
          </span>
          <br />
          <span className="text-gray-500 text-xl  py-2 mt-4 inline-block">
            👟 walking with you in the city 👟
          </span>
        </div>
      </div>
      <div className="embla w-[70%] h-full  rounded-md">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {slides.map((index) => (
              <div className="embla__slide" key={index}>
                {/* <div className="embla__slide__number">
                  <span>{index + 1}</span>
                </div> */}
                <img
                  className="embla__slide__img object-cover w-full h-full"
                  src={imageByIndex(index)}
                  alt="Your alt text"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Carousel;
