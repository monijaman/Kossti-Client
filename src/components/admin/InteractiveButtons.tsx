'use client'; // This makes it a Client Component

import { FC } from 'react';

interface InteractiveButtonProps {
  onEdit: () => void;
  onDelete: () => void;
}

const InteractiveButtons: FC<InteractiveButtonProps> = ({ onEdit, onDelete }) => {
  return (
    <div>
      <button
        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
        onClick={onEdit}
      >
        Edit
      </button>
      <button
        className="bg-red-500 text-white px-2 py-1 rounded"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  );
};

export default InteractiveButtons;
