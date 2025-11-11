import React, { useEffect } from "react";
import { Mic } from "lucide-react";
import { useDarkMode } from "@common/hooks/useDarkMode";

const WhisperContent: React.FC = () => {
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="w-full h-full flex items-center justify-end bg-transparent flex-col pb-1">
      <div className="flex flex-col items-center mb-2">
        <div className="bg-background dark:bg-secondary p-4 rounded-2xl">
          <p>Processing...</p>
        </div>
        <div className="top-full left-1/2 -ml-[5px] border-[5px] border-solid border-x-transparent border-b-transparent border-background dark:border-x-transparent dark:border-b-transparent dark:border-secondary" />
      </div>
      <div className="bg-background dark:bg-secondary p-4 rounded-2xl">
        <Mic className="size-5" />
      </div>
    </div>
  );
};

export const WhisperApp: React.FC = () => {
  return <WhisperContent />;
};
