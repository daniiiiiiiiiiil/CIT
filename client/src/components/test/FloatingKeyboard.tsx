export function FloatingKeyboard() {
    const rows = [14, 13, 11, 6];

    return (
        <div className="floating-keyboard" aria-hidden="true">
            {rows.map((count, ri) => (
                <div key={ri} className="fkb__row">
                    {Array.from({ length: count }).map((_, ki) => (
                        <div
                            key={ki}
                            className="fkb__key"
                            style={{ "--ki": ri * 14 + ki } as React.CSSProperties}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}