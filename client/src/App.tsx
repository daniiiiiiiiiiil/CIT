import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CategoriesPage from "./pages/CategoriesPage";
import TestPage from "./pages/TestPage";
import AdminPage from "./pages/AdminPage";
import ResultPage from "./pages/ResultPage";
import ProfilePage from "./pages/ProfilePage";
import ErrorPage from "./pages/ErrorPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PrintCertificatePage from "./pages/PrintCertificatePage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/test/:id" element={<TestPage />} />
                <Route path="/result/:id" element={<ResultPage />} />
                <Route path="/print-certificate" element={<PrintCertificatePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin/*" element={<AdminPage />} />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;