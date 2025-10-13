import React from "react";
import nodata from "../../assets/video/no_data_found.json";
import Lottie from "lottie-react";
const No_data_found = () => {
  return (
    <div className="flex justify-center items-center h-[30em]">
      <Lottie
        animationData={nodata}
        loop={true}
        className="w-100 h-[30em] drop-shadow-lg"
      />
    </div>
  );
};

export default No_data_found;
