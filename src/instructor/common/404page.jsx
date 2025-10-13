import React from "react";
import { useNavigate } from "react-router";

import Lottie from "lottie-react";
import notfound from "../../assets/video/404 page.json";
import { Button } from "@/components/ui/button";

const Notfoundpage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen light:bg-gradient-to-br from-indigo-100 via-blue-100  to-blue-100 flex flex-col items-center justify-center p-6">
      <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl">
        <Lottie
          animationData={notfound}
          loop={true}
          className="w-full h-auto drop-shadow-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-2xl" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mt-8 tracking-tight">
        404 - Page Not Found
      </h1>
      <p className="text-lg md:text-xl mt-4 text-gray-600 max-w-md">
        Uh-oh! It looks like you're lost in space. The page you're looking for
        doesn't exist.
      </p>
      <Button
        className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
        onClick={() => navigate(-1)}
      >
        Go Back
      </Button>
    </div>
  );
};

export default Notfoundpage;
