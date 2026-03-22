const API_BASE = 'http://localhost:5282/api';

async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
}

async function postData(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ body: data })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error posting ${endpoint}:`, error);
        throw error;
    }
}

async function postDataDirect(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error posting ${endpoint}:`, error);
        throw error;
    }
}

async function putData(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ body: data })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error putting ${endpoint}:`, error);
        throw error;
    }
}

async function putDataDirect(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error putting ${endpoint}:`, error);
        throw error;
    }
}

async function patchData(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ body: data })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // PATCH might return 204 No Content
        if (response.status === 204) return null;
        return await response.json();
    } catch (error) {
        console.error(`Error patching ${endpoint}:`, error);
        throw error;
    }
}

async function patchDataDirect(endpoint) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (response.status === 204) return null;
        return await response.json();
    } catch (error) {
        console.error(`Error patching ${endpoint}:`, error);
        throw error;
    }
}

export const api = {
    // Reservas
    getReservas: () => fetchData('/reservas'),
    getReservasByDate: (dateStr) => fetchData(`/reservas/date/${dateStr}`),
    getReserva: (publicId) => fetchData(`/reservas/${publicId}`),
    createReserva: (data) => postDataDirect('/reservas', data),
    updateReserva: (publicId, data) => putDataDirect(`/reservas/${publicId}`, data),
    deleteReserva: (publicId) => patchDataDirect(`/reservas/${publicId}`),

    // Pistas
    getPistas: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return fetchData(queryString ? `/pistas?${queryString}` : '/pistas');
    },
    createPista: (data) => postData('/pistas', data),
    updatePista: (slug, data) => putData(`/pistas/${slug}`, data),
    deletePista: (slug) => patchData(`/pistas/${slug}`, { slug, isActive: false }),

    // Deportes
    getDeportes: () => fetchData('/deportes'),
    createDeporte: (data) => postData('/deportes', data),
    updateDeporte: (slug, data) => putData(`/deportes/${slug}`, data),
    deleteDeporte: (slug) => patchData(`/deportes/${slug}`, { slug, isActive: false }),

    // Mantenimientos
    getMantenimientos: () => fetchData('/mantenimiento'),
    getMantenimiento: (publicId) => fetchData(`/mantenimiento/${publicId}`),
    createMantenimiento: (data) => postDataDirect('/mantenimiento', data),
    updateMantenimiento: (publicId, data) => putDataDirect(`/mantenimiento/${publicId}`, data),
};

export default api;

