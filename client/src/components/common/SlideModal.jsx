import React, { useEffect, useRef, useState } from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const SlideModal = ({ isOpen, onClose, children }) => {

  const { slideModal } = useAppContext();

  const startY = useRef(0);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {

    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");

  }, [isOpen]);

  const handleTouchStart = (e) => {

    startY.current = e.touches[0].clientY;
    setIsDragging(true);

  };

  const handleTouchMove = (e) => {

    if (!isDragging) return;

    const currentY = e.touches[0].clientY;
    const delta = currentY - startY.current;

    if (delta > 0) {
      setDragY(delta);
    }

  };

  const handleTouchEnd = () => {

    setIsDragging(false);

    if (dragY > 120) {
      onClose();
    }

    setDragY(0);

  };

  return (
    <>

      {/* Overlay */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 bg-black/50 z-60
          transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Modal */}
      <div
        className={`
          fixed flex flex-col gap-3 z-70 bg-white dark:bg-transparent
          dark:bg-gradient-to-b from-[#242124] to-[#000000]/30
          backdrop-blur-3xl border-l border-[#80609F]/30
          transition-transform duration-300 ease-out p-5

          /* Desktop */
          sm:top-0 sm:right-0 sm:h-screen sm:min-w-80 sm:max-w-80
          ${isOpen ? "sm:translate-x-0" : "sm:translate-x-full"}

          /* Mobile */
          max-sm:bottom-0 max-sm:left-0 max-sm:w-full max-sm:h-3/4
          max-sm:rounded-t-2xl
          ${isOpen ? "max-sm:translate-y-0" : "max-sm:translate-y-full"}
        `}
        style={{
          transform:
            isDragging && dragY > 0 ? `translateY(${dragY}px)` : undefined,
        }}
      >

        <div className="flex flex-col gap-3">

          <div
            className="w-15 h-1.5 bg-gray-400/60 rounded-full mx-auto my-2 max-sm:block hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />

          {/* Title */}
          <div className="flex flex-row justify-between items-center gap-5">

            <h2 className="text-2xl font-medium text-black dark:invert">{slideModal?.title}</h2>

            <div className="flex items-center gap-3 sm:gap-2">
              <div className="flex items-center">{slideModal?.titleFeature}</div>
              <img src={assets.close_icon} className="h-5 w-5 not-dark:invert cursor-pointer" onClick={()=>onClose()} alt="" />
            </div>

          </div>

        </div>

        <div className="flex flex-1 w-full overflow-y-scroll">
          {children}
        </div>

      </div>

    </>
  );
};

export default SlideModal;
