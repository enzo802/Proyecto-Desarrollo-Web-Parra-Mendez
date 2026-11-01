import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Inicio from "./pages/Inicio";
import Resenas from "./pages/Resenas";
import Foros from "./pages/Foros";
import Trivia from "./pages/Trivia";
import Login from "./pages/Login";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/resenas" element={<Resenas />} />
        <Route path="/foros" element={<Foros />} />
        <Route path="/trivia" element={<Trivia />} />
      </Route>
    </Routes>
  );
}