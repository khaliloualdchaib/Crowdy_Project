import React from "react";

function Cameras({ cameras, globalCount }) {
  // Function to convert ArrayBuffer to base64 string
  const toBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  return (
    <div>
      <div className="my-4 flex justify-center">Total Count: {globalCount}</div>
      <div className="flex flex-wrap justify-center">
        {Object.entries(cameras).map(([cameraNumber, cameraData]) => {
          // Create the data URL for the image
          const imageSrc = `data:image/png;base64,${toBase64(
            cameraData.photo
          )}`;
          return (
            <div
              key={cameraNumber}
              className="p-2 w-1/4 h-1/4 flex items-center justify-center"
            >
              <figure className="relative w-full h-full">
                <img
                  className="w-full h-full object-cover"
                  src={imageSrc}
                  alt={`Camera ${cameraNumber}`}
                />
                <figcaption class="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
                  Camera {cameraNumber} has {cameraData.count} heads
                </figcaption>
              </figure>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Cameras;
