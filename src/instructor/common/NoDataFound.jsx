import React from "react";
import Lottie from "lottie-react";
import No_data_found from "@/assets/animations/No_data_found.json"

const NoDataFound = () => {
  return (
    <div className="flex justify-center items-center h-[30em]">
      <Lottie
        animationData={No_data_found}
        loop={true}
        className="w-100 h-[30em] drop-shadow-lg"
      />
    </div>
  );
};

export default NoDataFound;
