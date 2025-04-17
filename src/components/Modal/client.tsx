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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-[70%] max-w-[800px]">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-red hover:text-gray-700 font-bold py-2 px-4 focus:outline-none"
                >
                    X
                </button>
                <div className="mt-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
