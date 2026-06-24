import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { Camera, Download, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const FindMyPhotos = () => {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('id'); // Gets ID from QR code URL
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSelfieCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      setLoading(true);
      setHasSearched(true);
      
      // Clean the base64 string
      const base64Data = reader.result.split(',')[1];

      try {
        const response = await api.post('/ai/find-me', {
          eventId: eventId,
          selfieBase64: base64Data
        });

        setPhotos(response.data);
        if (response.data.length === 0) {
          toast.error("No matches found. Try another selfie!");
        } else {
          toast.success(`Found ${response.data.length} photos of you!`);
        }
      } catch (error) {
        console.error(error);
        toast.error("AI matching failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Find Your Photos</h1>
        <p className="text-slate-500 mb-8">Take a selfie, and our AI will find all your photos from the event.</p>

        {/* Upload/Camera Button */}
        <div className="flex justify-center mb-10">
          <label className="relative cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-orange-200 transition-all flex items-center gap-3 active:scale-95">
            <Camera size={24} />
            <span>Take a Selfie</span>
            <input 
              type="file" 
              accept="image/*" 
              capture="user" // Opens front camera on mobile
              className="hidden" 
              onChange={handleSelfieCapture}
              disabled={loading}
            />
          </label>
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
            <p className="text-slate-600 font-medium">Scanning event database for your face...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div key={photo._id} className="relative group rounded-xl overflow-hidden shadow-sm bg-white">
                <img 
                  src={`https://clikz-event-photos.s3.amazonaws.com/${photo.s3Key}`} 
                  alt="Matched content"
                  className="w-full h-64 object-cover"
                />
                <a 
                  href={`https://clikz-event-photos.s3.amazonaws.com/${photo.s3Key}`}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-full text-slate-800 hover:text-orange-500 transition-colors"
                >
                  <Download size={20} />
                </a>
              </div>
            ))}
          </div>
        )}

        {hasSearched && !loading && photos.length === 0 && (
          <div className="py-20 text-slate-400">
            <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
            <p>We couldn't find any photos with your face yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindMyPhotos;
