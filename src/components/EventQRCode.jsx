import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2 } from 'lucide-react';

const EventQRCode = ({ eventId, eventName }) => {
  // This is the URL the guest will visit on their mobile
  const guestURL = `https://app.clikzweddingfilms.in/find-my-photos?id=${eventId}`;

  const downloadQR = () => {
    const svg = document.getElementById("event-qr");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${eventName}-QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
      <h3 className="font-bold text-slate-800 mb-4">Guest Access QR Code</h3>
      <div className="flex justify-center mb-4 bg-slate-50 p-4 rounded-xl">
        <QRCodeSVG id="event-qr" value={guestURL} size={200} includeMargin={true} />
      </div>
      <p className="text-xs text-slate-500 mb-4 truncate">{guestURL}</p>
      <div className="flex gap-2">
        <button 
          onClick={downloadQR}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-900 transition-all"
        >
          <Download size={16} /> Download
        </button>
      </div>
    </div>
  );
};

export default EventQRCode;
