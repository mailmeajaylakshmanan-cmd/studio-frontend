import axios from 'axios';
import api from '../api/axios';

export const uploadAndIndexPhoto = async (file, eventId) => {
  // 1. Get the pre-signed URL from our Backend
  const { data } = await api.post('/ai/get-upload-url', {
    eventId,
    fileName: file.name,
    fileType: file.type
  });

  // 2. Upload the file DIRECTLY to S3
  await axios.put(data.url, file, {
    headers: { 'Content-Type': file.type }
  });

  // 3. Tell our Backend to start AI Face Indexing
  await api.post('/ai/process-upload', {
    eventId,
    s3Key: data.s3Key
  });

  return data.s3Key;
};
