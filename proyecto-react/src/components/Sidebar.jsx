import { NavLink } from "react-router-dom";

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <h1 className="logo">PopScore</h1>

            <nav className="sidebar-nav">
                <NavLink to="/" end>Inicio</NavLink>
                <NavLink to="/resenas">Resenas</NavLink>
                <NavLink to="/foros">Foros</NavLink>
                <NavLink to="/trivia">Trivia</NavLink>
            </nav>

            <div className="sidebar-bottom">
                <NavLink to="/configuracion">Configuracion</NavLink>
                <NavLink to="/login">Iniciar sesion</NavLink>
            </div>
        </aside>
    );
}