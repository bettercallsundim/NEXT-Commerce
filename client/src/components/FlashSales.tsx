import React from "react";
import Card1 from "./Cards/Card1/Card1";
import Card2 from "./Cards/Card2/Card2";

const FlashSales = () => {
  const imaged = [
    {
      original:
        "https://cdn.thewirecutter.com/wp-content/media/2024/05/white-sneaker-2048px-9452-2x1-1.jpg?width=2048&quality=75&crop=2:1&auto=webp",
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
  return (
    <div className="mt-40">
      <div className="font-bold text-4xl underline text-gray-800 px-4 py-2  mb-8">
        Flash Sales
      </div>
      <div className="grid grid-cols-4 gap-8 justify-between">
        {new Array(12).fill(0).map((_, idx) => {
          const random = Math.floor(Math.random() * imaged.length - 1) + 1;

          return <Card2 key={idx} img={imaged[random].original} />;
        })}
      </div>
    </div>
  );
};

export default FlashSales;
