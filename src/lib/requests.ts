// utils/api.ts
import axios, { AxiosRequestConfig } from 'axios';


export const makeRequest = async <T = any>(options: AxiosRequestConfig): Promise<T> => {
    try {
        const response = await axios(options);
        return response.data;
    } catch (error: any) {
        // You can improve this with custom error formatting
        console.error('API Request Error:', error);
        throw error;
    }
};
