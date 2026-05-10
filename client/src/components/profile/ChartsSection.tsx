import { Bar, Doughnut, Radar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    LineElement,
    PointElement,
    RadialLinearScale,
    Filler,
    Tooltip,
    Legend,
} from "chart.js";
import type { TooltipItem } from "chart.js";
import type { TestResult, CategoryStats } from "../../types/profile.types";

// Регистрация компонентов Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    LineElement,
    PointElement,
    RadialLinearScale,
    Filler,
    Tooltip,
    Legend
);

interface ChartsSectionProps {
    results: TestResult[];
    last10: TestResult[];
    topCategories: CategoryStats[];
    passRate: number;
    passedCount: number;
    failedCount: number;
}

export function ChartsSection({ results, last10, topCategories, passRate, passedCount, failedCount }: ChartsSectionProps) {
    if (results.length === 0) return null;

    const barData = {
        labels: last10.map(r => r.categoryName?.slice(0, 8) || "Тест"),
        datasets: [{
            label: "%",
            data: last10.map(r => r.percent),
            backgroundColor: last10.map(r => r.passed ? "rgba(0,255,136,0.7)" : "rgba(255,71,87,0.6)"),
            borderColor: last10.map(r => r.passed ? "#00ff88" : "#ff4757"),
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false as const,
        }],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (c: TooltipItem<"bar">) => `${c.parsed.y}%` } }
        },
        scales: {
            x: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "rgba(255,255,255,0.35)", font: { size: 10 } } },
            y: { min: 0, max: 100, grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "rgba(255,255,255,0.35)", font: { size: 10 }, callback: (v: number | string) => v + "%" } },
        },
    };

    const donutData = {
        labels: ["Сдано", "Не сдано"],
        datasets: [{
            data: results.length > 0 ? [passedCount, failedCount] : [1, 0],
            backgroundColor: ["#00ff88", "#ff4757"],
            borderWidth: 0,
            hoverOffset: 4
        }],
    };

    const donutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "72%",
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: TooltipItem<"doughnut">) => `${c.label}: ${c.parsed}` } } },
    };

    const sortedResults = [...results].sort((a, b) => new Date(a.finishedAt).getTime() - new Date(b.finishedAt).getTime());
    const lineData = {
        labels: sortedResults.slice(-12).map((_, i) => `#${i + 1}`),
        datasets: [{
            label: "Результат",
            data: sortedResults.slice(-12).map(r => r.percent),
            borderColor: "#534AB7",
            backgroundColor: "rgba(83,74,183,0.15)",
            pointBackgroundColor: sortedResults.slice(-12).map(r => r.passed ? "#00ff88" : "#ff4757"),
            pointBorderColor: "transparent",
            pointRadius: 5,
            fill: true,
            tension: 0.4,
        }],
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "rgba(255,255,255,0.3)", font: { size: 10 } } },
            y: { min: 0, max: 100, grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "rgba(255,255,255,0.3)", font: { size: 10 }, callback: (v: number | string) => v + "%" } },
        },
    };

    const radarLabels = topCategories.slice(0, 5).map(c => c.name.slice(0, 12));
    const radarData = {
        labels: radarLabels,
        datasets: [{
            label: "Средний %",
            data: topCategories.slice(0, 5).map(c => c.avg),
            backgroundColor: "rgba(83,74,183,0.25)",
            borderColor: "#534AB7",
            pointBackgroundColor: "#00d4ff",
            pointBorderColor: "transparent",
            pointRadius: 4,
        }],
    };

    const radarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            r: {
                min: 0,
                max: 100,
                grid: { color: "rgba(255,255,255,0.08)" },
                ticks: { display: false },
                pointLabels: { color: "rgba(255,255,255,0.5)", font: { size: 10 } },
                angleLines: { color: "rgba(255,255,255,0.06)" },
            },
        },
    };

    return (
        <div className="pf-charts">
            <div className="pf-chart-card pf-chart-card--wide">
                <div className="pf-chart-card__header">
                    <span className="pf-chart-card__num">01</span>
                    <div>
                        <div className="pf-chart-card__title">Динамика результатов</div>
                        <div className="pf-chart-card__sub">Последние {last10.length} попыток</div>
                    </div>
                    <div className="pf-chart-legend">
                        <span><span className="pf-dot" style={{ background: "#00ff88" }} />Сдан</span>
                        <span><span className="pf-dot" style={{ background: "#ff4757" }} />Не сдан</span>
                    </div>
                </div>
                <div style={{ height: 180 }}><Bar data={barData} options={barOptions} /></div>
            </div>

            <div className="pf-chart-card pf-chart-card--wide">
                <div className="pf-chart-card__header">
                    <span className="pf-chart-card__num">02</span>
                    <div>
                        <div className="pf-chart-card__title">Тренд обучения</div>
                        <div className="pf-chart-card__sub">Прогресс во времени</div>
                    </div>
                </div>
                <div style={{ height: 180 }}><Line data={lineData} options={lineOptions} /></div>
            </div>

            <div className="pf-chart-card">
                <div className="pf-chart-card__header">
                    <span className="pf-chart-card__num">03</span>
                    <div>
                        <div className="pf-chart-card__title">Распределение</div>
                        <div className="pf-chart-card__sub">Сдано / Не сдано</div>
                    </div>
                </div>
                <div className="pf-donut-wrap">
                    <div style={{ position: "relative", height: 150, width: 150 }}>
                        <Doughnut data={donutData} options={donutOptions} />
                        <div className="pf-donut-center">
                            <span className="pf-donut-val">{passRate}%</span>
                            <span className="pf-donut-sub">сдано</span>
                        </div>
                    </div>
                    <div className="pf-chart-legend pf-chart-legend--col">
                        <span><span className="pf-dot" style={{ background: "#00ff88" }} />Сдано ({passedCount})</span>
                        <span><span className="pf-dot" style={{ background: "#ff4757" }} />Не сдано ({failedCount})</span>
                    </div>
                </div>
            </div>

            {topCategories.length >= 3 && (
                <div className="pf-chart-card">
                    <div className="pf-chart-card__header">
                        <span className="pf-chart-card__num">04</span>
                        <div>
                            <div className="pf-chart-card__title">По компетенциям</div>
                            <div className="pf-chart-card__sub">Средний балл</div>
                        </div>
                    </div>
                    <div style={{ height: 190 }}><Radar data={radarData} options={radarOptions} /></div>
                </div>
            )}
        </div>
    );
}