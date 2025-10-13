import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import logo from "../../assets/logo/image.png";
import { CheckToken } from "../Redux/Api/pingApi";


const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { loading, error, success } = useSelector((state) => state.CheckToken);
  const [checkedToken, setCheckedToken] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/EmployeeeLogin");
    } else {
      dispatch(CheckToken({ token })).then(() => {
        setCheckedToken(true);
      });
    }
  }, [dispatch, token, navigate]);

  // ✅ Show loader while checking
  if (!checkedToken || loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center text-white">
        <div className="relative flex justify-center items-center">
          <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
          <img src={logo} alt="Loading" className="rounded-full h-28 w-28" />
        </div>
      </div>
    );
  }

  // ✅ If token check failed
  if (!success || error) {
    localStorage.removeItem("token");
    return navigate("/EmployeeeLogin");
  }

  // ✅ Token is valid
  return <Outlet />;
};

export default ProtectedRoute;
