import { useState, useEffect, useRef } from "react";
import type { TestResult } from "../../types/result.types";

interface CertificateProps {
    result: TestResult;
    userName: string;
    date: string;
}

export function Certificate({ result, userName, date }: CertificateProps) {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVisible(true); observer.disconnect(); }
        }, { threshold: 0.2 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    // Формирование уникального QR кода (имитация)
    const qrData = `CERT-${result.certificateNumber}-${result.finishedAt.slice(0, 10)}`;

    return (
        <div ref={ref} className={`res-cert ${visible ? "res-cert--visible" : ""}`}>
            <div className="res-cert__bg" />
            <div className="res-cert__watermark">ПРОФЦИФРА</div>

            {["tl", "tr", "bl", "br"].map(c => (
                <div key={c} className={`res-cert__corner res-cert__corner--${c}`} />
            ))}

            <div className="res-cert__scan" />
            <div className="res-cert__shine" />

            <div className="res-cert__header">
                <div className="res-cert__logo">
                    <span className="res-cert__logo-bracket">[</span>
                    ПрофЦифра
                    <span className="res-cert__logo-bracket">]</span>
                </div>
                <div className="res-cert__badges">
                    <span className="res-cert__badge res-cert__badge--verified">VERIFIED</span>
                    <span className="res-cert__badge res-cert__badge--green">✓ PASSED</span>
                </div>
            </div>

            <div className="res-cert__divider" />

            <div className="res-cert__title-wrap">
                <div className="res-cert__title">СЕРТИФИКАТ</div>
                <div className="res-cert__subtitle">об успешном прохождении аттестации</div>
            </div>

            <div className="res-cert__body">
                <p className="res-cert__label">Настоящим подтверждается, что</p>
                <div className="res-cert__name">{userName}</div>
                <p className="res-cert__desc">
                    успешно прошёл(а) аттестацию по цифровым компетенциям
                </p>
                <div className="res-cert__program">«ПрофЦифра Аттестация»</div>

                <div className="res-cert__score-wrap">
                    <div className="res-cert__score-item">
                        <span className="res-cert__score-val">{result.percent}%</span>
                        <span className="res-cert__score-key">Результат</span>
                    </div>
                    <div className="res-cert__score-sep" />
                    <div className="res-cert__score-item">
                        <span className="res-cert__score-val">
                            {result.totalCorrect}/{result.totalQuestions}
                        </span>
                        <span className="res-cert__score-key">Правильных ответов</span>
                    </div>
                </div>
            </div>

            <div className="res-cert__divider" />

            <div className="res-cert__footer">
                <div className="res-cert__footer-left">
                    <div className="res-cert__signature">
                        <div className="res-cert__signature-line" />
                        <span className="res-cert__signature-name">Директор Центра</span>
                    </div>
                </div>

                <div className="res-cert__qr">
                    <div className="res-cert__qr-code">{qrData.slice(0, 16)}</div>
                    <span className="res-cert__qr-label">Проверить подлинность</span>
                </div>

                <div className="res-cert__footer-right">
                    <div className="res-cert__footer-item">
                        <span className="res-cert__footer-label">Дата выдачи</span>
                        <span className="res-cert__footer-val">{date}</span>
                    </div>
                    <div className="res-cert__footer-item">
                        <span className="res-cert__footer-label">Номер сертификата</span>
                        <span className="res-cert__footer-val">{result.certificateNumber}</span>
                    </div>
                </div>
            </div>

            <div className="res-cert__stamp">
                <div className="res-cert__stamp-inner">ЦИТ</div>
            </div>

            <div className="res-cert__seal">
                <div className="res-cert__seal-inner">✓</div>
            </div>
        </div>
    );
}