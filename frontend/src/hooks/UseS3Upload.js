// hooks/useS3Upload.js
// Two-step S3 upload:
//   1. POST /signatures/s3 via apiConnector (auth handled automatically)
//      body: { fileName, fileType, fileSize } → { uploadUrl }
//   2. PUT file directly to S3 presigned URL (no auth header — URL is self-contained)

import { useState, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { apiConnector } from '../services/apiconnector';
import { SignatureEndpoints } from '../services/apis';

const { POST_SIGNATURE_S3_API } = SignatureEndpoints;

export const useS3Upload = () => {
    const [uploading, setUploading]           = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // No token param — apiConnector reads auth from Redux store / cookie
    const uploadToS3 = useCallback(async (file) => {
        if (!file) return null;

        setUploading(true);
        setUploadProgress(0);

        try {
            // ── Step 1: get presigned PUT URL from your backend ───────────
            // apiConnector attaches Authorization header automatically
            const response = await apiConnector(
                'POST',
                POST_SIGNATURE_S3_API,
                {
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || 'Could not get upload URL');
            }

            const { uploadUrl } = response.data.data;
            // Backend uses fileName as the S3 Key — derive it the same way
            const key = file.name;

            // ── Step 2: PUT file directly to S3 ──────────────────────────
            // Must use plain axios here — apiConnector would add an Authorization
            // header which S3 presigned URLs reject (they are self-contained).
            await axios.put(uploadUrl, file, {
                headers: { 'Content-Type': file.type },
                onUploadProgress: (e) => {
                    if (e.total) {
                        setUploadProgress(Math.round((e.loaded / e.total) * 100));
                    }
                },
            });

            return { key, size: file.size };
        } catch (err) {
            console.error('S3 upload error:', err);
            toast.error(
                err?.response?.data?.message || err.message || 'File upload failed'
            );
            return null;
        } finally {
            setUploading(false);
        }
    }, []);

    return { uploadToS3, uploading, uploadProgress };
};