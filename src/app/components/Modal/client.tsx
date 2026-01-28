// components/Modal.js
import { ReactNode } from 'react';
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-lg relative w-[90%] max-w-[1000px] max-h-[90vh] flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 font-bold text-2xl focus:outline-none z-10"
                >
                    ✕
                </button>
                <div className="overflow-y-auto p-6 pt-10">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
