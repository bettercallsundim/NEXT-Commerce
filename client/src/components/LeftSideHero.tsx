import React from "react";

const LeftSideHero = () => {
  return (
    <div className="w-[30%]  rounded-md pt-8 flex flex-col justify-around gap-x-4 gap-y-4 z-10">
      <div className="space-y-2">
        <span className="text-[25px] xl:text-[50px] font-bold text-gray-950 bg-cyan-500 rounded-md px-4 py-2 inline-block">
          NEXT Commerce
        </span>
        <br />
        <span className="text-gray-500 xl:text-xl  py-2 mt-4 inline-block">
          👟 walking with you in the city 👟
        </span>
      </div>
      <div className="w-full aspect-square rounded-md ">
        <img
          src="https://media.architecturaldigest.com/photos/57a11cbeb6c434ab487bc26b/16:9/w_1280,c_limit/nikes-senior-designer-explains-what-went-into-new-air-jordan-01.png"
          alt=""
          className="w-full h-full rounded-md object-cover"
        />
      </div>
    </div>
  );
};

export default LeftSideHero;
