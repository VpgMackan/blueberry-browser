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
    <div className="w-full h-full flex items-center justify-center bg-transparent">
      <div className="bg-background dark:bg-secondary p-4 rounded-2xl">
        <Mic className="size-5" />
      </div>
    </div>
  );
};

export const WhisperApp: React.FC = () => {
  return <WhisperContent />;
};
