import React from "react";
import Lottie from "lottie-react";
import LoadingFile from "@/assets/animations/Loading.json"

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-[30em]">
      <Lottie
        animationData={LoadingFile}
        loop={true}
        className="w-100 h-[30em] drop-shadow-lg"
      />
    </div>
  );
};

export default Loading;
