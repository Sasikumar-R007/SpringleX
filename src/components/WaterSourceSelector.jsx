import React, { useState } from "react";

const WaterSourceSelector = () => {
  const [status, setStatus] = useState("Device Offline");

  const handleRotate = async (angle) => {
    try {
      const res = await fetch(`http://192.168.4.1/rotate?angle=${angle}`);
      const text = await res.text();
      console.log(text);
      setStatus(`Rotated to ${angle}°`);
    } catch (error) {
      console.error("Failed to rotate:", error);
      setStatus("Device Offline");
    }
  };

  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold">Water Source</h2>
      <p className={`text-sm ${status === "Device Offline" ? "text-red-500" : "text-green-500"}`}>
        {status}
      </p>

      <div className="flex gap-3">
        <button onClick={() => handleRotate(0)} className="bg-gray-800 text-white px-4 py-2 rounded-2xl">
          Bore Well (0°)
        </button>
        <button onClick={() => handleRotate(90)} className="bg-gray-800 text-white px-4 py-2 rounded-2xl">
          Rain Water (90°)
        </button>
        <button onClick={() => handleRotate(180)} className="bg-gray-800 text-white px-4 py-2 rounded-2xl">
          Canal Water (180°)
        </button>
      </div>
    </div>
  );
};

export default WaterSourceSelector;