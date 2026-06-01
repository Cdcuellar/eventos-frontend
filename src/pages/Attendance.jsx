import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Attendance() {

    const navigate = useNavigate();

    const [registrations, setRegistrations] = useState([]);

    useEffect(() => {

        loadRegistrations();

    }, []);

    const loadRegistrations = async () => {

        try {

            const response =
                await api.get("/registrations");

            setRegistrations(
                response.data
            );

        } catch (error) {

            console.error(error);

        }

    };

    const markAttendance = async (id) => {

        const confirmAttendance =
            window.confirm(
                "¿Confirmar asistencia de este participante?"
            );

        if (!confirmAttendance) return;

        try {

            await api.put(
                `/registrations/${id}/attendance`
            );

            alert(
                "Asistencia registrada"
            );

            loadRegistrations();

        } catch (error) {

            console.error(error);

            alert(
                "Error al registrar asistencia"
            );

        }

    };

    return (

        <div className="container mt-5">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>
                    Gestión de Asistencias
                </h2>

                <button
                    className="btn btn-secondary"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>

            </div>

            <table className="table table-dark table-striped">

                <thead>

                    <tr>

                        <th>Usuario</th>

                        <th>Evento</th>

                        <th>Asistencia</th>

                        <th>Acción</th>

                    </tr>

                </thead>

                <tbody>

                    {registrations.map(
                        (registration) => (

                        <tr
                            key={registration.id}
                        >

                            <td>
                                {
                                    registration.user.name
                                }
                            </td>

                            <td>
                                {
                                    registration.event.title
                                }
                            </td>

                            <td>

                                {
                                    registration.attended
                                        ? "✓ Asistió"
                                        : "Pendiente"
                                }

                            </td>

                            <td>

                                {
                                    !registration.attended && (

                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() =>
                                                markAttendance(
                                                    registration.id
                                                )
                                            }
                                        >
                                            ✓ Confirmar asistencia
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

export default Attendance;