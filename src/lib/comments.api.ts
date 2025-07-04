// Base URL for API requests
import { makeRequest } from './requests';
import type { Comment } from './comment.types';
const API_BASE_URL = 'http://localhost:3000';
const SERVICE_NAME = 'comment';


// create comment
export const createComment = async (data: Comment) => {
    return makeRequest({
        method: 'POST',
        url: `${API_BASE_URL}/${SERVICE_NAME}`,
        data,
    });
};

// get comment by ID
export const getCommentById = async (id: string) => {
    return makeRequest<Comment>({
        method: 'GET',
        url: `${API_BASE_URL}/${SERVICE_NAME}/${id}`,
    });
};

// update comment
export const updateComment = async (id: string, data: Comment) => {
    return makeRequest({
        method: 'PUT',
        url: `${API_BASE_URL}/${SERVICE_NAME}/${id}`,
        data,
    });
};

// delete comment
export const deleteComment = async (id: string) => {
    return makeRequest({
        method: 'DELETE',
        url: `${API_BASE_URL}/${SERVICE_NAME}/${id}`,
    });
};