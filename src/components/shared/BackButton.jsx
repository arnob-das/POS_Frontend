import React from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
    const navigate = useNavigate();
     
  return (
    <div onClick={()=>navigate(-1)} className="bg-blue-500 text-white text-xl font-bold p-3 rounded-lg">
      <IoArrowBackOutline />
    </div>
  );
};

export default BackButton;
