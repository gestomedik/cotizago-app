// lib/api.ts - Cliente API para CotizaGO
// ✅ VERSIÓN CORREGIDA - CAMBIO: usuario_id → agente_id

const API_URL = '/api';

// Función helper para obtener el ID del usuario autenticado
function getUserId(): number | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.id || null;
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        return null;
      }
    }
  }
  return null;
}

// Función helper para obtener headers con autenticación
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('🔑 Token agregado a headers'); // Para debug
    } else {
      console.warn('⚠️ No hay token en localStorage');
    }
  }
  
  return headers;
}

// Función principal para hacer peticiones a la API
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  
  console.log('📡 Petición:', url);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Error del servidor:', data);
      throw new Error(data.message || data.error || `API Error: ${response.status}`);
    }
    
    console.log('✅ Respuesta exitosa:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en fetchAPI:', error);
    throw error;
  }
}

// ✅ CAMBIO PRINCIPAL: Export con const en lugar de default
export const api = {
  // ========== AUTENTICACIÓN ==========
  auth: {
    login: (email: string, password: string) => 
      fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    
    me: () => fetchAPI('/auth/me'),
    
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
  },

  // ========== CLIENTES ==========
  clientes: {
    list: (params?: { recurrente?: boolean; search?: string }) => {
      const queryParams = new URLSearchParams();
      if (params?.recurrente) queryParams.append('recurrente', '1');
      if (params?.search) queryParams.append('search', params.search);
      
      const query = queryParams.toString();
      return fetchAPI(`/clientes${query ? `?${query}` : ''}`);
    },
    
    get: (id: number) => fetchAPI(`/clientes/${id}`),
    
    create: (data: any) => fetchAPI('/clientes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
    update: (id: number, data: any) => fetchAPI(`/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
    delete: (id: number) => fetchAPI(`/clientes/${id}`, {
      method: 'DELETE',
    }),
  },

  // ========== PASAJEROS ==========
  pasajeros: {
    list: (clienteId?: number) => {
      const query = clienteId ? `?cliente_id=${clienteId}` : '';
      return fetchAPI(`/pasajeros${query}`);
    },
    
    get: (id: number) => fetchAPI(`/pasajeros/${id}`),
    
    create: (data: any) => fetchAPI('/pasajeros', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
    update: (id: number, data: any) => fetchAPI(`/pasajeros/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
    delete: (id: number) => fetchAPI(`/pasajeros/${id}`, {
      method: 'DELETE',
    }),
    
    uploadDocument: async (id: number, tipo: 'frontal' | 'reverso', file: File) => {
      const formData = new FormData();
      formData.append('tipo', tipo);
      formData.append('documento', file);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/pasajeros/${id}/documento`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      return response.json();
    },
  },

  // ========== COTIZACIONES ==========
  cotizaciones: {
    // ✅ CORREGIDO: usuario_id → agente_id
    list: (params?: { 
      estado?: string; 
      cliente_id?: number; 
      agente_id?: number;  // ✅ CAMBIADO DE usuario_id
    }) => {
      const queryParams = new URLSearchParams();
      if (params?.estado) queryParams.append('estado', params.estado);
      if (params?.cliente_id) queryParams.append('cliente_id', params.cliente_id.toString());
      if (params?.agente_id) queryParams.append('agente_id', params.agente_id.toString());  // ✅ CAMBIADO
      
      const query = queryParams.toString();
      return fetchAPI(`/cotizaciones${query ? `?${query}` : ''}`);
    },
    
    get: (id: number) => fetchAPI(`/cotizaciones/${id}`),
    
    create: (data: any) => {
      const userId = getUserId();
      
      if (!userId) {
        throw new Error('Usuario no autenticado. Por favor, inicia sesión nuevamente.');
      }
      
      const payload = {
        ...data,
        agente_id: userId,  // ✅ Ya estaba correcto
      };
      
      console.log('Creando cotización con payload:', payload);
      
      return fetchAPI('/cotizaciones', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    
    update: (id: number, data: any) => fetchAPI(`/cotizaciones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
    delete: (id: number) => fetchAPI(`/cotizaciones/${id}`, {
      method: 'DELETE',
    }),
    
    cambiarEstado: (id: number, estado: string) => fetchAPI(`/cotizaciones/${id}/estado`, {
      method: 'PUT',
      body: JSON.stringify({ estado }),
    }),
  },

  // ========== SERVICIOS (Vuelos, Hoteles, etc.) ==========
  servicios: {
    vuelos: {
      list: (cotizacionId: number) => fetchAPI(`/cotizaciones/${cotizacionId}/vuelos`),
      create: (cotizacionId: number, data: any) => fetchAPI(`/cotizaciones/${cotizacionId}/vuelos`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
      delete: (cotizacionId: number, vueloId: number) => 
        fetchAPI(`/cotizaciones/${cotizacionId}/vuelos/${vueloId}`, { method: 'DELETE' }),
    },
    
    hoteles: {
      list: (cotizacionId: number) => fetchAPI(`/cotizaciones/${cotizacionId}/hoteles`),
      create: (cotizacionId: number, data: any) => fetchAPI(`/cotizaciones/${cotizacionId}/hoteles`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
      delete: (cotizacionId: number, hotelId: number) => 
        fetchAPI(`/cotizaciones/${cotizacionId}/hoteles/${hotelId}`, { method: 'DELETE' }),
    },
    
    transportes: {
      list: (cotizacionId: number) => fetchAPI(`/cotizaciones/${cotizacionId}/transportes`),
      create: (cotizacionId: number, data: any) => fetchAPI(`/cotizaciones/${cotizacionId}/transportes`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
      delete: (cotizacionId: number, transporteId: number) => 
        fetchAPI(`/cotizaciones/${cotizacionId}/transportes/${transporteId}`, { method: 'DELETE' }),
    },
    
    tours: {
      list: (cotizacionId: number) => fetchAPI(`/cotizaciones/${cotizacionId}/tours`),
      create: (cotizacionId: number, data: any) => fetchAPI(`/cotizaciones/${cotizacionId}/tours`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
      delete: (cotizacionId: number, tourId: number) => 
        fetchAPI(`/cotizaciones/${cotizacionId}/tours/${tourId}`, { method: 'DELETE' }),
    },
    
    seguros: {
      list: (cotizacionId: number) => fetchAPI(`/cotizaciones/${cotizacionId}/seguros`),
      create: (cotizacionId: number, data: any) => fetchAPI(`/cotizaciones/${cotizacionId}/seguros`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
      delete: (cotizacionId: number, seguroId: number) => 
        fetchAPI(`/cotizaciones/${cotizacionId}/seguros/${seguroId}`, { method: 'DELETE' }),
    },
  },

  // ========== PLANTILLAS ==========
  plantillas: {
    list: (params?: { 
      destino?: string; 
      temporada?: string; 
      categoria?: string;
    }) => {
      const queryParams = new URLSearchParams();
      if (params?.destino) queryParams.append('destino', params.destino);
      if (params?.temporada) queryParams.append('temporada', params.temporada);
      if (params?.categoria) queryParams.append('categoria', params.categoria);
      
      const query = queryParams.toString();
      return fetchAPI(`/plantillas${query ? `?${query}` : ''}`);
    },
    
    get: (id: number) => fetchAPI(`/plantillas/${id}`),
    
    create: (data: any) => fetchAPI('/plantillas', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
    update: (id: number, data: any) => fetchAPI(`/plantillas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
    delete: (id: number) => fetchAPI(`/plantillas/${id}`, {
      method: 'DELETE',
    }),
  },

  // ========== DASHBOARD ==========
  dashboard: {
    resumen: () => fetchAPI('/dashboard/resumen'),
    proximos: () => fetchAPI('/dashboard/proximos'),
    mes: () => fetchAPI('/dashboard/mes'),
    enProceso: () => fetchAPI('/dashboard/en-proceso'),
    completados: () => fetchAPI('/dashboard/completados'),
  },

  // ========== COMISIONES ==========
  comisiones: {
    list: (params?: { 
      estado?: string;
      fecha_inicio?: string;
      fecha_fin?: string;
    }) => {
      const queryParams = new URLSearchParams();
      if (params?.estado) queryParams.append('estado', params.estado);
      if (params?.fecha_inicio) queryParams.append('fecha_inicio', params.fecha_inicio);
      if (params?.fecha_fin) queryParams.append('fecha_fin', params.fecha_fin);
      
      const query = queryParams.toString();
      return fetchAPI(`/comisiones${query ? `?${query}` : ''}`);
    },
    
    marcarPagada: (id: number) => fetchAPI(`/comisiones/${id}/pagar`, {
      method: 'PUT',
    }),
  },

  // ========== REPORTES ==========
  reportes: {
    ventas: (fechaInicio: string, fechaFin: string) => 
      fetchAPI(`/reportes/ventas?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`),
    
    comisiones: (fechaInicio: string, fechaFin: string) => 
      fetchAPI(`/reportes/comisiones?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`),
    
    clientes: () => fetchAPI('/reportes/clientes'),
    
    destinos: () => fetchAPI('/reportes/destinos'),
  },

  // ========== USUARIOS ==========
  usuarios: {
    list: () => fetchAPI('/usuarios'),
    
    get: (id: number) => fetchAPI(`/usuarios/${id}`),
    
    create: (data: any) => fetchAPI('/usuarios', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
    update: (id: number, data: any) => fetchAPI(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
    delete: (id: number) => fetchAPI(`/usuarios/${id}`, {
      method: 'DELETE',
    }),
  },
};

// ✅ CORRECCIÓN COMPLETA
// Cambios realizados:
// 1. Línea ~159: usuario_id → agente_id en params
// 2. Línea ~167: usuario_id → agente_id en queryParams.append()
