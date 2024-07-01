// components/CustomModal.tsx

import React, { ReactNode } from "react";
import "../style/CustomModal.scss";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <button className="closeButton" onClick={onClose}>
          &times;
        </button>
        <div className="modalBody">{children}</div>
      </div>
    </div>
  );
};

export default CustomModal;
