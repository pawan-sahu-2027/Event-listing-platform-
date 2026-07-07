import React from "react";
import { Button } from "./ui/button";

function GeneralInfo() {
  return (
    <div className="px-4 mt-10">
      
      {/* Background Card */}
      <div className="w-full mx-auto h-[350px] m-3 md:h-[450px] rounded-xl overflow-hidden relative bg-[url('/i1.png')] bg-cover bg-center">
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-6 space-y-4">
          
          <h1 className="text-2xl md:text-4xl font-bold">
            Learn More About the World of Coffee ☕
          </h1>

          <h2 className="text-lg md:text-2xl font-semibold">
            Art & Science of Coffee Brewing
          </h2>

          <p className="max-w-xl text-sm md:text-base text-gray-200">
            Discover the fascinating world of coffee brewing, from the science behind
            the perfect cup to the art of creating unique flavors.
          </p>

          <Button className="bg-blue-500 hover:bg-blue-700 text-white px-5 py-2 rounded">
            Learn More
          </Button>

        </div>
      </div>
    </div>
  );
}

export default GeneralInfo;