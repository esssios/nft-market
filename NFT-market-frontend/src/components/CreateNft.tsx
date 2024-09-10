import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useWallet } from '../state/walletContext';

function CreateNft() {
  // const { walletAddress } = useWallet();
  const walletData = useWallet();
  const walletAddress = walletData ? walletData.walletAddress : "";

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleCancel = () => {
    // Reset the form or specific form fields
    setTitle('');
    setDescription('');
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    if (fileInputRef.current.files.length === 0) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', fileInputRef.current.files[0]);
    formData.append('to', walletAddress);

    try {
      const response = await axios.post('http://127.0.0.1:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Handle the response from the server here
      console.log('File uploaded successfully', response.data);
      navigate("/my-nft");
    } catch (error) {
      // Handle the error here
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="max-w-2xl m-auto mt-50px p-20px rounded-xl card-shadow">
      <h1>Upload Image to IPFS and Mint NFT</h1>
      <form className="flex-col" onSubmit={handleUpload}>
        <label htmlFor="title" className="mt-10px">Title *</label>
        <input
          className="p-10px mt-5px border border-gray rounded"
          type="text"
          id="title"
          placeholder="Enter image title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label htmlFor="description" className="mt-10px">Description</label>
        <textarea
          className="p-10px mt-5px border border-gray rounded"
          id="description"
          placeholder="Describe your image"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label htmlFor="file" className="mt-10px">Image *</label>
        <input
          className="mt-10px"
          type="file"
          id="file"
          ref={fileInputRef}
          required
        />
        <div className="buttons mt-10px flex justify-between mt-20px">
          <button type="button" className="h-31px w-100px bg-#8f8f8f c-white btn-no-border rounded" onClick={handleCancel}>Cancel</button>
          <button type="submit" className="h-31px w-100px bg-#006dfe c-white btn-no-border rounded">Upload</button>
        </div>
      </form>
    </div>
  );
}

export default CreateNft;