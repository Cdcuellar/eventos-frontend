import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function Register() {

const navigate = useNavigate();

const [form, setForm] = useState({
    name: "",
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
            "/register",
            form
        );

        localStorage.setItem(
            "token",
            response.data.token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(
                response.data.user
            )
        );

        alert(
            "Usuario registrado correctamente"
        );

        navigate("/dashboard");

    } catch (error) {

        console.error(error);

        alert(
            JSON.stringify(
                error.response?.data ||
                error.message
            )
        );

    }
};

return (
    <div className="container mt-5">

        <div className="d-flex align-items-center mb-4">

            <Link
                to="/"
                className="btn btn-outline-light me-3"
            >
                ←
            </Link>

            <div>

                <h2>EventHub</h2>

                <p className="text-secondary">
                    Crear una nueva cuenta
                </p>

            </div>

        </div>

        <form onSubmit={handleSubmit}>

            <input
                className="form-control mb-3"
                type="text"
                name="name"
                placeholder="Nombre"
                onChange={handleChange}
            />

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
                className="btn btn-primary"
            >
                Registrarse
            </button>

        </form>

    </div>
);


}

export default Register;
