import React, { useState } from 'react';
import { uploadAndIndexPhoto } from '../utils/s3Upload';
import toast from 'react-hot-toast';

const AdminPhotoUpload = ({ eventId }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    let count = 0;

    for (const file of files) {
      try {
        await uploadAndIndexPhoto(file, eventId);
        count++;
        setProgress(Math.round((count / files.length) * 100));
      } catch (err) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
    toast.success(`Successfully uploaded and AI-indexed ${count} photos!`);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-4">
      <h3 className="text-lg font-bold mb-4 text-slate-800">Event Photo Gallery (AI Auto-Match)</h3>
      <input 
        type="file" 
        multiple 
        accept="image/*" 
        onChange={handleUpload}
        disabled={uploading}
        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
      />
      {uploading && (
        <div className="mt-4">
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-orange-500 h-full transition-all" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">Processing: {progress}% completed...</p>
        </div>
      )}
    </div>
  );
};

export default AdminPhotoUpload;
