"use client";

import React from "react";
import Logo from "./Logo";
import UserMenu from "./UserMenu";

interface NavbarProps {
  showBack?: boolean;
  onBack?: () => void;
}

/**
 * Componente Navbar principal.
 * Se encarga únicamente de la estructura y disposición de los elementos.
 */
const Navbar: React.FC<NavbarProps> = ({ showBack = false, onBack }) => {
  return (
    <nav className="w-full bg-primary-900 h-16 px-6 flex items-center justify-between shadow-md relative z-50 font-sans">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <Logo width={32} height={32} className="!justify-start" />
        <span className="text-white font-bold text-lg hidden md:block uppercase tracking-wider">
          Process Platform
        </span>
      </div>

      {/* User Actions & Menu */}
      <UserMenu showBack={showBack} onBack={onBack} />
    </nav>
  );
};

export default Navbar;
