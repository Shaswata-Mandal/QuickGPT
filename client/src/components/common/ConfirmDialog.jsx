import React from 'react'

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {

  return (
    <div className="flex flex-col gap-6">

      <p className="text-sm text-gray-700 dark:text-gray-200">
        {message}
      </p>

      <div className="flex justify-end gap-3">

        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-md border text-sm dark:text-white dark:border-white"
        >
          Cancel
        </button>

        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-md bg-red-600 text-white text-sm"
        >
          Confirm
        </button>

      </div>

    </div>
  );

};

export default ConfirmDialog