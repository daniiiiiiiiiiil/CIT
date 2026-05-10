interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = "Поиск по категориям..." }: SearchInputProps) {
    return (
        <div className="cat-search">
            <div className="cat-search__wrapper">
                <span className="cat-search__icon">⌕</span>
                <input
                    type="text"
                    className="cat-search__input"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                {value && (
                    <button className="cat-search__clear" onClick={() => onChange("")}>✕</button>
                )}
            </div>
        </div>
    );
}