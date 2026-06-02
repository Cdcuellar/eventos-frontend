import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/*
                  Definición de rutas principales de la aplicación.
                  Cada ruta carga la página React correspondiente.
                */}
                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/attendance"
                    element={<Attendance />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;