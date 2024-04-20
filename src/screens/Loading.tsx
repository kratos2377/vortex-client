import React from "react";
import { Vortex } from "../components/backgrounds/vortex";
 

const Loading = () => {
    return (
        <div className="w-100% mx-auto rounded-md  h-screen overflow-hidden">
          <Vortex
            backgroundColor="black"
            rangeY={800}
            particleCount={500}
            baseHue={120}
            className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
          >
            <h4 className="text-white text-2xl md:text-6xl font-bold text-center">
                Loading...
            </h4>

          </Vortex>
        </div>
      );
}

export default Loading