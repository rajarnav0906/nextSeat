import { useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const IDUpload = ({ userId, onSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const frontRef = useRef();
  const backRef = useRef();

  const [frontFileName, setFrontFileName] = useState('');
  const [backFileName, setBackFileName] = useState('');

  const handleUpload = async () => {
    const frontFile = frontRef.current?.files[0];
    const backFile = backRef.current?.files[0];

    if (!frontFile || !backFile) {
      return toast.error('Please upload both sides of ID card');
    }

    const formData = new FormData();
    formData.append('frontImage', frontFile);
    formData.append('backImage', backFile);
    formData.append('userId', userId);

    try {
      setUploading(true);
      const res = await axios.post('http://localhost:8080/auth/upload-id', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('ID card processed successfully');
      onSuccess(res.data.user);
    } catch (err) {
      const msg = err.response?.data?.message || 'Upload failed';
      toast.error(msg);

      // Reset file inputs & filenames
      if (frontRef.current) frontRef.current.value = '';
      if (backRef.current) backRef.current.value = '';
      setFrontFileName('');
      setBackFileName('');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#FAFFCA] text-[#2D2D2D] p-6 rounded-xl shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Upload College ID Card</h2>

      <div className="mb-4">
        <label className="block text-sm mb-1 font-medium">Front Side</label>
        <input
          ref={frontRef}
          type="file"
          accept="image/*"
          onChange={(e) => setFrontFileName(e.target.files[0]?.name || '')}
          className="block w-full text-sm file:bg-[#84AE92] file:text-white file:rounded-full file:px-4 file:py-2"
        />
        {frontFileName && <p className="text-xs mt-1 text-gray-600">Selected: {frontFileName}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1 font-medium">Back Side</label>
        <input
          ref={backRef}
          type="file"
          accept="image/*"
          onChange={(e) => setBackFileName(e.target.files[0]?.name || '')}
          className="block w-full text-sm file:bg-[#84AE92] file:text-white file:rounded-full file:px-4 file:py-2"
        />
        {backFileName && <p className="text-xs mt-1 text-gray-600">Selected: {backFileName}</p>}
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="w-full bg-[#5A827E] hover:bg-[#84AE92] text-white font-medium py-2 rounded-lg"
      >
        {uploading ? 'Uploading...' : 'Submit'}
      </button>
    </div>
  );
};

export default IDUpload;
