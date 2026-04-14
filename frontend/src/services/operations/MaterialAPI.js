// ─── Material operations ──────────────────────────────────────────────────────
// Replace the axios-based material functions at the bottom of courseDetailsAPI.js
// with these. apiConnector already attaches the Authorization header from your
// Redux auth state / cookie — no manual token passing needed.

import { apiConnector } from '../apiconnector';
import { subSectionMaterialEndpoints } from '../apis';
import toast from 'react-hot-toast';

const {
    CREATE_MATERIAL_API,
    GET_MATERIAL_API,
    UPDATE_MATERIAL_API,
    DELETE_MATERIAL_API,
} = subSectionMaterialEndpoints;

// ─── Add Material ─────────────────────────────────────────────────────────────
export const addMaterial = async (materialData) => {
    const toastId = toast.loading('Adding material...');
    let result = null;
    try {
        const response = await apiConnector('POST', CREATE_MATERIAL_API, materialData);
        if (!response?.data?.success)
            throw new Error(response?.data?.message || 'Failed to add material');
        toast.success('Material added successfully');
        result = response.data.data; // { material }
    } catch (err) {
        console.error('addMaterial error:', err);
        toast.error(err?.response?.data?.message || err.message || 'Failed to add material');
    } finally {
        toast.dismiss(toastId);
    }
    return result;
};

// ─── Get Material ─────────────────────────────────────────────────────────────
export const getMaterial = async (subsectionId) => {
    const toastId = toast.loading('Loading material...');
    let result = null;
    try {
        const url = GET_MATERIAL_API.replace(':subsectionId', subsectionId);
        const response = await apiConnector('GET', url);
        if (!response?.data?.success)
            throw new Error(response?.data?.message || 'Failed to fetch material');
        result = response.data.data.material;
    } catch (err) {
        console.error('getMaterial error:', err);
        toast.error(err?.response?.data?.message || 'Failed to fetch material');
    } finally {
        toast.dismiss(toastId);
    }
    return result;
};

// ─── Update Material ──────────────────────────────────────────────────────────
export const updateMaterial = async (subsectionId, materialData) => {
    const toastId = toast.loading('Updating material...');
    let result = null;
    try {
        const url = UPDATE_MATERIAL_API.replace(':subsectionId', subsectionId);
        const response = await apiConnector('PATCH', url, materialData);
        if (!response?.data?.success)
            throw new Error(response?.data?.message || 'Failed to update material');
        toast.success('Material updated');
        result = response.data.data.material;
    } catch (err) {
        console.error('updateMaterial error:', err);
        toast.error(err?.response?.data?.message || err.message || 'Failed to update material');
    } finally {
        toast.dismiss(toastId);
    }
    return result;
};

// ─── Delete Material ──────────────────────────────────────────────────────────
export const deleteMaterial = async (subsectionId) => {
    const toastId = toast.loading('Deleting material...');
    let result = false;
    try {
        const url = DELETE_MATERIAL_API.replace(':subsectionId', subsectionId);
        const response = await apiConnector('DELETE', url);
        if (!response?.data?.success)
            throw new Error(response?.data?.message || 'Failed to delete material');
        toast.success('Material deleted');
        result = true;
    } catch (err) {
        console.error('deleteMaterial error:', err);
        toast.error(err?.response?.data?.message || err.message || 'Failed to delete material');
    } finally {
        toast.dismiss(toastId);
    }
    return result;
};