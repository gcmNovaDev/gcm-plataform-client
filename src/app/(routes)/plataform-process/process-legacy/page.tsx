"use client";

import React from "react";
import Navbar from "@/gcm-plataform/components/ui/Navbar";

export default function ProcessLegacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 w-full bg-white relative">
        <iframe 
          src="http://10.0.0.231:8080/" 
          className="w-full h-full absolute inset-0 border-0"
          title="Legacy Process System"
        />
      </main>
    </div>
  );
}
