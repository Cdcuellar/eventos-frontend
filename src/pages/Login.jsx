import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await api.post(
                "/login",
                form
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            navigate("/dashboard");

        } catch {

            alert(
                "Correo o contraseña incorrectos"
            );

        }
    };

    return (
        <div className="container mt-5">

            <div className="d-flex justify-content-between mb-4">

                <h2>Iniciar Sesión</h2>

                <Link
                    to="/register"
                    className="btn btn-primary"
                >
                    Registrarse
                </Link>

            </div>

            <form onSubmit={handleSubmit}>

                <input
                    className="form-control mb-3"
                    type="email"
                    name="email"
                    placeholder="Correo"
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    onChange={handleChange}
                />

                <button
                    className="btn btn-success"
                >
                    Ingresar
                </button>

            </form>

        </div>
    );
}

export default Login;