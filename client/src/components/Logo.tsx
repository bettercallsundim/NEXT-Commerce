import React from "react";

type Props = {};

const Logo = (props: Props) => {
  return (
    <div className="flex items-center gap-x-4">
      <div className="text-cyan-500 bg-black w-[60px] aspect-square rounded-full uppercase flex items-center justify-center font-bold text-sm">
        <span>NEXT</span>
      </div>
      <div className="text-3xl font-semibold text-gray-800 dark:text-gray-300">
        NEXT Commerce
      </div>
    </div>
  );
};

export default Logo;
