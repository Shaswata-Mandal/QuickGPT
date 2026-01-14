import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

//Disclaimer: This component was coded with the assistance of AI for implementing advanced features.

const BASE_Z = 100;

const PopOverModal = () => {

  const { popOverStack, closePopOverModalAt, popOverClosingIndex, closeTopPopOverModal } = useAppContext();

  const stackSize = popOverStack.length;

  /* 🔒 Lock body scroll */
  useEffect(() => {

    if (stackSize > 0) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };

  }, [stackSize]);

  /* ⌨️ ESC closes top modal */
  useEffect(() => {

    if (!stackSize) return;

    const handler = (e) => {
      if (e.key === "Escape") {
        closePopOverModalAt(stackSize - 1);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);

  }, [stackSize]);

  if (!stackSize) return null;

  return (
    <>
      {popOverStack.map((modal, index) => {

        const isTop = index === stackSize - 1;
        const overlayOpacity = Math.min(0.55 + index * 0.55, 0.65);

        return (

          <div key={modal.id}>

            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black transition-opacity duration-300"
              style={{
                zIndex: BASE_Z + index * 2,
                opacity: overlayOpacity,
              }}
              onClick={() => closePopOverModalAt(index)}
            />

            {/* Modal Wrapper */}
            <div
              className="fixed inset-0 flex items-center justify-center"
              style={{
                zIndex: BASE_Z + index * 2 + 1,
                pointerEvents: "none"
              }}
            >

              {/* Modal */}
              <div
                className={`
                  w-[90%] max-w-md max-h-[85vh]
                  bg-white dark:bg-gradient-to-b from-[#242124] to-[#000000]
                  backdrop-blur-3xl border border-[#80609F]/30 dark:border-white
                  rounded-2xl p-5
                  flex flex-col gap-5 pointer-events-auto
                  transition-all duration-300 ease-out
                  ${isTop ? "scale-100" : "scale-95 brightness-95"}
                  ${popOverClosingIndex === index ? "animate-modal-fall" : ""}
                `}
              >

                {/* Header */}
                <div className="flex items-center justify-between">

                  <h2 className="text-xl font-medium dark:text-white">
                    {modal.title}
                  </h2>

                  {isTop && (
                    <img
                      src={assets.close_icon}
                      className="h-5 w-5 cursor-pointer not-dark:invert"
                      onClick={() => closePopOverModalAt(index)}
                      alt="Close"
                    />
                  )}

                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  {modal.content}
                </div>

              </div>

            </div>

          </div>

        );

      })}
    </>
  );
};

export default PopOverModal;
