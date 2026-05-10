import type { FloatingCodeLine, TerminalLine } from "../types/test.types";

export const FLOATING_CODE_LINES: FloatingCodeLine[] = [
    "const future = await build();",
    "import { skill } from 'mind';",
    "git push origin main",
    "npm run excellence",
    "SELECT * FROM knowledge;",
    "docker build -t legend .",
    "while(true) { learn(); }",
    "export default greatness;",
    "ssh root@next-level.dev",
    "pip install ambition==∞",
    "async fn solve() -> Result",
    "kubectl apply -f dreams.yml",
].map((text, i) => ({
    text,
    delay: (i * 1.7) % 12,
    x: (i * 8.3) % 90,
    duration: 14 + (i % 5) * 3,
}));

export const TERMINAL_LINES: TerminalLine[] = [
    { text: "$ node server.js", color: "#06ffa5" },
    { text: "  ► listening on :3000", color: "#64748b" },
    { text: "$ git status", color: "#06ffa5" },
    { text: "  On branch main", color: "#94a3b8" },
    { text: "  modified: index.tsx", color: "#fbbf24" },
    { text: "$ npm run build", color: "#06ffa5" },
    { text: "  > vite build", color: "#64748b" },
    { text: "  ✓ built in 1.2s", color: "#06ffa5" },
    { text: "$ docker ps", color: "#06ffa5" },
    { text: "  api   Up 3h  ✓", color: "#94a3b8" },
    { text: "  db    Up 3h  ✓", color: "#94a3b8" },
    { text: "$ ping future.dev", color: "#06ffa5" },
    { text: "  64 bytes: time=1ms", color: "#64748b" },
    { text: "$ ssh deploy@prod", color: "#06ffa5" },
    { text: "  Welcome back! 🚀", color: "#7c3aed" },
    { text: "▋", color: "#00d4ff" },
];

export const CODE_ROWS = [
    { ln: "01", code: "import React from 'react'", c: "#7c3aed" },
    { ln: "02", code: "import { build } from './future'", c: "#94a3b8" },
    { ln: "03", code: "", c: "" },
    { ln: "04", code: "const App = () => {", c: "#00d4ff" },
    { ln: "05", code: "  const [data, setData]", c: "#e2e8f0" },
    { ln: "06", code: "    = useState(null)", c: "#e2e8f0" },
    { ln: "07", code: "", c: "" },
    { ln: "08", code: "  return <Future />", c: "#06ffa5" },
    { ln: "09", code: "}", c: "#00d4ff" },
    { ln: "10", code: "", c: "" },
    { ln: "11", code: "export default App", c: "#fbbf24" },
];

export const generateParticles = () =>
    Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 6,
        dur: 4 + Math.random() * 4,
    }));