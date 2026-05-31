import { useNavigate } from "react-router-dom";

function Dashboard() {

const navigate = useNavigate();

const token =
    localStorage.getItem("token");

const logout = () => {

    localStorage.removeItem("token");

    navigate("/");

};

return (
    <div className="container mt-5">

        <div className="d-flex justify-content-between align-items-center mb-4">

            <h1>Dashboard</h1>

            <button
                className="btn btn-danger"
                onClick={logout}
            >
                Cerrar sesión
            </button>

        </div>

        <p>
            Usuario autenticado correctamente.
        </p>

        <p>
            Token:
        </p>

        <textarea
            className="form-control"
            rows="6"
            value={token || ""}
            readOnly
        />

    </div>
);

}

export default Dashboard;
