const API_URL = 'http://localhost:5001/api';

export const api = {
    get: async (endpoint: string) => {
        const token = localStorage.getItem('token');
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}${endpoint}`, { headers });
        if (!response.ok) throw new Error(`API error: ${response.statusText}`);
        return response.json();
    },

    post: async (endpoint: string, body: any) => {
        const token = localStorage.getItem('token');
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `API error: ${response.statusText}`);
        return data;
    },

    patch: async (endpoint: string, body: any) => {
        const token = localStorage.getItem('token');
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(body),
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `API error: ${response.statusText}`);
        return data;
    },

    delete: async (endpoint: string) => {
        const token = localStorage.getItem('token');
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers,
        });
        
        if (!response.ok) throw new Error(`API error: ${response.statusText}`);
        return true;
    }
};
