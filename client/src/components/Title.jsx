import React from "react";

const Title = ({ title, className }) => {
  return (
    <h1
      className={`text-2xl md:text-3xl font-bold font-orbitron text-[#FFFFFF] drop-shadow-[0_1px_3px_rgba(64,196,255,0.5)] ${className}`}
    >
      {title}
    </h1>
  );
};

export default Title;