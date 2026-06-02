import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

/**
 * Página principal del dashboard.
 *
 * Muestra el listado de eventos, permite CRUD de eventos
 * y gestiona inscripciones según el rol del usuario.
 */
function Dashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [events, setEvents] = useState([]);
    
    const [stats, setStats] = useState({
        events: 0,
        users: 0,
        registrations: 0
    });

    const [form, setForm] = useState({
        title: "",
        description: "",
        event_date: "",
        location: "",
        capacity: ""
    });

    const [editingId, setEditingId] = useState(null);

    useEffect(() => {

        loadEvents();

        if (user?.role === "admin") {

            loadStats();

        }

    }, []);

    /**
     * READ: Cargar eventos.
     *
     * Obtiene el listado de eventos desde la API.
     */
    const loadEvents = async () => {

        try {

            const response = await api.get("/events");

            setEvents(response.data);

        } catch (error) {

            console.error(error);

        }

    };

    /**
     * Consultar estadísticas.
     *
     * Obtiene los totales generales para mostrar
     * en el panel administrativo.
     */
    const loadStats = async () => {

        try {

            const response =
                await api.get("/stats");

            setStats(response.data);

        } catch (error) {

            console.error(error);

        }

    };

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    /**
     * CREATE: Crear evento.
     *
     * Envía los datos para crear un nuevo evento.
     */
    const createEvent = async (e) => {

        e.preventDefault();

        try {

            await api.post("/events", form);

            alert("Evento creado correctamente");

            setForm({
                title: "",
                description: "",
                event_date: "",
                location: "",
                capacity: ""
            });

            loadEvents();

        } catch (error) {

            console.error(error);

            console.log(error.response);

            alert(
                JSON.stringify(
                    error.response?.data || error.message
                )
            );

        }

    };

    /**
     * DELETE: Eliminar evento.
     *
     * Solicita confirmación y borra el evento seleccionado.
     */
    const deleteEvent = async (id) => {

    const confirmDelete =
            window.confirm(
                "¿Seguro que deseas eliminar este evento?"
            );

        if (!confirmDelete) return;

        try {

            await api.delete(`/events/${id}`);

            alert("Evento eliminado");

            loadEvents();

        } catch (error) {

            console.error(error);

            alert("Error al eliminar");

        }

    };

    /**
     * Inscribirse a evento.
     *
     * Registra al usuario autenticado en el evento.
     */
    const registerToEvent = async (eventId) => {

        try {

            await api.post(
                `/events/${eventId}/register`
            );

            alert("Inscripción realizada");
            
            loadEvents();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Error al inscribirse"
            );

        }

    };
    /**
     * Cancelar inscripción.
     *
     * Elimina la inscripción del usuario para el evento.
     */
    const unregisterFromEvent = async (eventId) => {

        try {

            await api.delete(
                `/events/${eventId}/register`
            );

            alert(
                "Inscripción cancelada"
            );
            loadEvents();

        } catch (error) {

            console.error(error);

            alert(
                "Error al cancelar inscripción"
            );

        }

    };
    

    /**
     * Preparar UPDATE.
     *
     * Carga los datos del evento en el formulario para editarlo.
     */
    const editEvent = (event) => {

        setForm({
            title: event.title,
            description: event.description,
            event_date: event.event_date.split(" ")[0],
            location: event.location,
            capacity: event.capacity
        });

        setEditingId(event.id);

    };

    /**
     * UPDATE: Actualizar evento.
     *
     * Envía los cambios al servidor y recarga
     * la lista de eventos una vez actualizado.
     */
    const updateEvent = async (e) => {

        e.preventDefault();

        try {

            await api.put(
                `/events/${editingId}`,
                form
            );

            alert("Evento actualizado");

            setEditingId(null);

            setForm({
                title: "",
                description: "",
                event_date: "",
                location: "",
                capacity: ""
            });

            loadEvents();

        } catch (error) {

            console.error(error);

            alert("Error al actualizar");

        }

    };

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/");

    };

    return (
        <div className="container mt-5">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div className="mb-4">

                    <h1>
                        EventHub
                    </h1>

                    <p className="text-secondary">
                        Plataforma de Gestión de Eventos Académicos y Tecnológicos
                    </p>

                </div>

                {
                    // Gestión visual de roles: solo los administradores
                    // ven el acceso a la gestión de asistencias.
                    user?.role === "admin" && (

                        <button
                            className="btn btn-info mb-3"
                            onClick={() =>
                                navigate("/attendance")
                            }
                        >
                            Gestionar Asistencias
                        </button>

                    )
                }


                {
                    user?.role === "admin" && (
                        

                        <div className="row mb-4">

                            <div className="col">

                                <div className="card bg-dark text-white">

                                    <div className="card-body text-center">

                                        <h5>Eventos</h5>

                                        <h2>{stats.events}</h2>

                                    </div>

                                </div>

                            </div>

                            <div className="col">

                                <div className="card bg-dark text-white">

                                    <div className="card-body text-center">

                                        <h5>Usuarios</h5>

                                        <h2>{stats.users}</h2>

                                    </div>

                                </div>

                            </div>

                            <div className="col">

                                <div className="card bg-dark text-white">

                                    <div className="card-body text-center">

                                        <h5>Inscripciones</h5>

                                        <h2>{stats.registrations}</h2>

                                    </div>

                                </div>

                            </div>

                        </div>

                    )
                }

                <button
                    className="btn btn-danger"
                    onClick={logout}
                >
                    Cerrar sesión
                </button>

                <p>
                    Rol: {user?.role}
                </p>

            </div>

            {
                user?.role === "admin" && (
                    <form
                        className="mb-5"
                        onSubmit={
                            editingId
                                ? updateEvent
                                : createEvent
                        }
                    >

                        <h3>
                            {
                                editingId
                                    ? "Editar Evento"
                                    : "Crear Evento"
                            }
                        </h3>

                        <input
                            className="form-control mb-2"
                            type="text"
                            name="title"
                            placeholder="Título"
                            value={form.title}
                            onChange={handleChange}
                        />

                        <textarea
                            className="form-control mb-2"
                            name="description"
                            placeholder="Descripción"
                            value={form.description}
                            onChange={handleChange}
                        />

                        <input
                            className="form-control mb-2"
                            type="date"
                            name="event_date"
                            value={form.event_date}
                            onChange={handleChange}
                        />

                        <input
                            className="form-control mb-2"
                            type="text"
                            name="location"
                            placeholder="Lugar"
                            value={form.location}
                            onChange={handleChange}
                        />

                        <input
                            className="form-control mb-3"
                            type="number"
                            name="capacity"
                            placeholder="Cupos"
                            value={form.capacity}
                            onChange={handleChange}
                        />

                        <button
                            className="btn btn-success"
                            type="submit"
                        >
                            {
                                editingId
                                    ? "Actualizar Evento"
                                    : "Crear Evento"
                            }
                        </button>

                    </form>
                )
            }

            <h3>Eventos</h3>

            <table className="table table-dark table-striped">

                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Fecha</th>
                        <th>Lugar</th>
                        <th>Cupos</th>
                        <th>Inscritos</th>
                        <th>Disponibles</th>
                        {
                            user?.role === "admin" && (
                                <th>Acciones</th>
                            )
                        }
                        <th>Inscripción</th>
                    </tr>
                </thead>

                <tbody>

                    {events.map((event) => (

                        <tr key={event.id}>

                            <td>{event.title}</td>

                            <td>
                                {
                                    new Date(
                                        event.event_date
                                    ).toLocaleDateString(
                                        "es-CO"
                                    )
                                }
                            </td>

                            <td>{event.location}</td>

                            <td>{event.capacity}</td>

                            <td>{event.registered_count}</td>

                            <td>{event.available_slots}</td>

                           

                            {
                                user?.role === "admin" && (
                                    <td>
                                        <>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => editEvent(event)}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => deleteEvent(event.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </>

                                    </td>
                                )
                            }

                            <td>

                                {
                                    event.is_registered
                                    ? (

                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() =>
                                                unregisterFromEvent(event.id)
                                            }
                                        >
                                            Cancelar
                                        </button>

                                    )
                                    : (

                                        <button
                                            className="btn btn-primary btn-sm"
                                            disabled={event.available_slots === 0}
                                            onClick={() =>
                                                registerToEvent(event.id)
                                            }
                                        >
                                            {
                                                event.available_slots === 0
                                                    ? "Evento lleno"
                                                    : "Inscribirse"
                                            }
                                        </button>

                                    )
                                }

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default Dashboard;