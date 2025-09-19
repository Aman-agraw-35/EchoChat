import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const ImageUpload = ({ onImageSelect, onTypeChange }) => {
    const [preview, setPreview] = useState(null);
    
    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                onImageSelect(file);
                onTypeChange('custom');
            };
            reader.readAsDataURL(file);
        }
    }, [onImageSelect, onTypeChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif']
        },
        maxSize: 5242880, // 5MB
        multiple: false
    });

    const handleAvatarSelect = () => {
        setPreview(null);
        onImageSelect(null);
        onTypeChange('avatar');
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 mb-4">
                <button
                    type="button"
                    onClick={handleAvatarSelect}
                    className={`px-4 py-2 rounded ${
                        !preview ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                >
                    Use Avatar
                </button>
                <span>or</span>
            </div>

            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                    ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                    ${preview ? 'border-green-500' : ''}`}
            >
                <input {...getInputProps()} />
                {preview ? (
                    <div className="flex flex-col items-center">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-24 h-24 rounded-full object-cover mb-2"
                        />
                        <p className="text-sm text-gray-600">Click or drag to change</p>
                    </div>
                ) : (
                    <div>
                        {isDragActive ? (
                            <p>Drop the image here...</p>
                        ) : (
                            <div>
                                <p>Drag and drop an image here, or click to select</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    (Maximum size: 5MB)
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;