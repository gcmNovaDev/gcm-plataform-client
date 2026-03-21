import Image from "next/image";
import React from "react";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ width = 120, height = 120, className = "" }) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Image
        src="/Logo/GCM_Mesa_De_Trabajo1.png"
        alt="Portal Logo"
        width={width}
        height={height}
        priority
        className="object-contain"
      />
    </div>
  );
};

export default Logo;
