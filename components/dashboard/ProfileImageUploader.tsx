"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";

interface ProfileImageUploaderProps {
  initialImage?: string | null;
  onImageChange: (file: File) => void;
}

export const ProfileImageUploader = ({ initialImage, onImageChange }: ProfileImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageChange(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full border-2 border-gray-100 flex items-center justify-center overflow-hidden bg-[#F9FAFB]">
          {preview ? (
            <Image src={preview} alt="Profile" fill className="object-cover" />
          ) : (
            <div className="text-gray-300">
               <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
               </svg>
            </div>
          )}
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 w-full h-full rounded-full bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center"
        >
          {/* Overlay if needed */}
        </button>
      </div>
      
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="mt-4 flex items-center gap-1.5 text-sm font-bold text-gray-700 hover:text-emerald-600 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Add photo</span>
      </button>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};
