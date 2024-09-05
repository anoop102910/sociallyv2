import React, { useState } from "react";

const EnlargedImage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div onClick={handleClick} className="cursor-pointer ">
        {children}
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={handleClose}
        >
          <div className="bg-white p-4 rounded shadow-lg">{children}</div>
        </div>
      )}
    </>
  );
};

export default EnlargedImage;
