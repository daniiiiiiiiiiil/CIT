import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CertificatePrint } from "../components/result/CertificatePrint";

export default function PrintCertificatePage() {
    const [certData, setCertData] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const data = localStorage.getItem('printCertificate');
        if (!data) {
            navigate('/');
            return;
        }
        
        const parsed = JSON.parse(data);
        setCertData(parsed);
        
        localStorage.removeItem('printCertificate');
    }, [navigate]);

    if (!certData) {
        return <div>Загрузка...</div>;
    }

    return <CertificatePrint {...certData} />;
}