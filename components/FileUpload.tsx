
import React, { useCallback } from 'react';
import { UploadIcon, PdfIcon, CloseIcon } from './icons';

interface FileUploadProps {
  id: string;
  label: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ id, label, file, onFileSelect }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      onFileSelect(selectedFile);
    } else {
      onFileSelect(null);
      // Optional: Add user feedback for wrong file type
    }
  };

  const onDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
        onFileSelect(droppedFile);
    } else {
        onFileSelect(null);
    }
  }, [onFileSelect]);

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFileSelect(null);
    const input = document.getElementById(id) as HTMLInputElement;
    if(input) input.value = '';
  }

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-800 hover:bg-slate-700 transition-colors duration-300 ${file ? 'border-sky-500' : ''}`}
      >
        {!file ? (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            <UploadIcon />
            <p className="mb-2 text-sm text-slate-400">
              <span className="font-semibold text-sky-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4 relative w-full h-full">
            <button onClick={handleRemoveFile} className="absolute top-2 right-2 p-1 bg-slate-700 rounded-full hover:bg-red-500 transition-colors">
              <CloseIcon />
            </button>
            <PdfIcon />
            <p className="font-semibold text-slate-300 truncate w-full px-2">{file.name}</p>
            <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
          </div>
        )}
        <input
          id={id}
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};
