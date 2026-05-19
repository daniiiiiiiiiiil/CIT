// src/components/result/CertificatePrint.tsx
import { useEffect } from "react";
import { useParams } from "react-router-dom";

interface CertificatePrintProps {
    userName: string;
    certificateNumber: string;
    percent: number;
    totalCorrect: number;
    totalQuestions: number;
    date: string;
}

export function CertificatePrint({ 
    userName, 
    certificateNumber, 
    percent, 
    totalCorrect, 
    totalQuestions, 
    date 
}: CertificatePrintProps) {
    useEffect(() => {
        // Автоматически вызываем печать при загрузке компонента
        setTimeout(() => {
            window.print();
        }, 500);
    }, []);

    return (
        <div style={{
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#e8e8e8',
            padding: '40px',
            fontFamily: "'Segoe UI', Arial, sans-serif"
        }}>
            <div style={{
                width: '900px',
                background: 'white',
                padding: '50px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Фоновый водяной знак */}
                <div style={{
                    position: 'absolute',
                    bottom: '50px',
                    right: '50px',
                    fontSize: '80px',
                    opacity: 0.05,
                    fontWeight: 'bold',
                    transform: 'rotate(-15deg)',
                    pointerEvents: 'none'
                }}>
                    ПРОФЦИФРА
                </div>

                {/* Уголки */}
                <div style={{
                    position: 'absolute',
                    top: 20, left: 20,
                    width: 40, height: 40,
                    borderTop: '3px solid #1a1a2e',
                    borderLeft: '3px solid #1a1a2e'
                }} />
                <div style={{
                    position: 'absolute',
                    top: 20, right: 20,
                    width: 40, height: 40,
                    borderTop: '3px solid #1a1a2e',
                    borderRight: '3px solid #1a1a2e'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: 20, left: 20,
                    width: 40, height: 40,
                    borderBottom: '3px solid #1a1a2e',
                    borderLeft: '3px solid #1a1a2e'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: 20, right: 20,
                    width: 40, height: 40,
                    borderBottom: '3px solid #1a1a2e',
                    borderRight: '3px solid #1a1a2e'
                }} />

                {/* Шапка */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px',
                    paddingBottom: '20px',
                    borderBottom: '2px solid #e0e0e0'
                }}>
                    <div style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: '#1a1a2e'
                    }}>
                        <span style={{ color: '#00d4ff' }}>[</span>
                        ПрофЦифра
                        <span style={{ color: '#00d4ff' }}>]</span>
                    </div>
                    <div>
                        <span style={{
                            background: '#2ecc71',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            marginLeft: '10px'
                        }}>✓ PASSED</span>
                        <span style={{
                            background: '#3498db',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            marginLeft: '10px'
                        }}>VERIFIED</span>
                    </div>
                </div>

                {/* Заголовок */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{
                        fontSize: '42px',
                        color: '#1a1a2e',
                        letterSpacing: '4px',
                        marginBottom: '10px'
                    }}>СЕРТИФИКАТ</h1>
                    <p style={{ color: '#666', fontSize: '16px' }}>
                        об успешном прохождении аттестации
                    </p>
                </div>

                {/* Основное содержание */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <p style={{ color: '#555', marginBottom: '15px' }}>Настоящим подтверждается, что</p>
                    <h2 style={{
                        fontSize: '32px',
                        color: '#1a1a2e',
                        borderBottom: '2px solid #00d4ff',
                        display: 'inline-block',
                        paddingBottom: '10px',
                        marginBottom: '20px'
                    }}>{userName}</h2>
                    <p style={{ color: '#555', marginBottom: '15px' }}>
                        успешно прошёл(а) аттестацию по цифровым компетенциям
                    </p>
                    <div style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#00d4ff',
                        marginTop: '20px'
                    }}>«ПрофЦифра Аттестация»</div>
                </div>

                {/* Баллы */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '60px',
                    marginBottom: '50px',
                    padding: '20px',
                    background: '#f8f9fa',
                    borderRadius: '12px'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1a1a2e' }}>{percent}%</div>
                        <div style={{ color: '#666', fontSize: '14px' }}>Результат</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1a1a2e' }}>{totalCorrect}/{totalQuestions}</div>
                        <div style={{ color: '#666', fontSize: '14px' }}>Правильных ответов</div>
                    </div>
                </div>

                {/* Подвал */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    paddingTop: '30px',
                    borderTop: '2px solid #e0e0e0'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '180px',
                            borderBottom: '1px solid #333',
                            marginBottom: '8px'
                        }} />
                        <span style={{ fontSize: '12px', color: '#666' }}>Директор Центра</span>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            color: '#999',
                            marginBottom: '8px',
                            background: '#fafafa'
                        }}>
                            {certificateNumber?.slice(-9)}
                        </div>
                        <span style={{ fontSize: '12px', color: '#666' }}>Проверить подлинность</span>
                    </div>

                    <div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '12px', color: '#666' }}>Дата выдачи</div>
                            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>{date}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>Номер сертификата</div>
                            <div style={{ fontWeight: 'bold' }}>{certificateNumber}</div>
                        </div>
                    </div>
                </div>

                {/* Печать */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '30px',
                    paddingTop: '20px'
                }}>
                    <p style={{ fontSize: '10px', color: '#999' }}>
                        Документ действителен при предъявлении. Проверить подлинность можно на сайте profcifra.ru
                    </p>
                </div>
            </div>

            <style>{`
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                        background: white;
                    }
                    button {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}