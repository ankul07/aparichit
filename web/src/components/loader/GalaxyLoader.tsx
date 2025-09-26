import React from "react";

const GalaxyLoader: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <div className="w-full max-w-2xl px-4 flex justify-center">
        <iframe
          src="https://tenor.com/embed/1766607410217246636"
          className="w-full max-w-lg h-auto aspect-video rounded-2xl shadow-2xl"
          style={{
            border: "none",
            minWidth: "320px",
            minHeight: "180px",
            maxWidth: "600px",
            maxHeight: "338px",
          }}
          title="Galaxy Watch Eyes Loading"
          allow="autoplay"
        />
      </div>
    </div>
  );
};

export default GalaxyLoader;
