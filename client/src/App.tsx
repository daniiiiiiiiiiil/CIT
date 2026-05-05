import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TestPage from "./pages/TestPage";
import AdminPage from "./pages/AdminPage";
import ResultPage from "./pages/ResultPage";
import ErrorPage from "./pages/ErrorPage";
import "./styles/App.scss";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/result/:id" element={<ResultPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;