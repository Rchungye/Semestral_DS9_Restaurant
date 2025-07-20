import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import PedirYa from "../pages/PedirYa";
import IniciarSesion from "../pages/IniciarSesion";
import Kitchen from "../pages/kitchen"

const MainRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pedir-ya" element={<PedirYa />} />
            <Route path="/iniciar-sesion" element={<IniciarSesion />} />
            <Route path="/kitchen" element={<Kitchen />} />
        </Routes>
    );
};

export default MainRouter;
