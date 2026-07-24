import React from "react";

function Modal({ title, onCloseModal, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
      <div className="bg-[#1a1a1a] p-4 mx-4 shadow-lg w-full  max-w-lg rounded-lg">
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#333]">
          <h2 className="text-xl text-[#f5f5f5] font-bold">{title}</h2>
          <button
            className="text-2xl text-[#f5f5f5] font-bold hover:text-gray-400"
            onClick={() => onCloseModal()}
          >
            &times;
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
