import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Configuración centralizada de Axios.
 *
 * Define la URL base de la API y agrega encabezados
 * genéricos para todas las solicitudes.
 */

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization =
            `Bearer ${token}`;
    }

    return config;
});

/**
 * Interceptor HTTP para agregar el token de autorización
 * en cada solicitud cuando el usuario está autenticado.
 */

export default api;