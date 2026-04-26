export default function Field({ label, id, trailing, ...inputProps }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[11px] tracking-[0.18em] uppercase mb-2 text-[color:var(--text-muted)]"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          {...inputProps}
          className="w-full bg-transparent border-0 border-b py-2.5 pr-8 text-[15px] focus:outline-none transition-colors placeholder:opacity-40 text-[color:var(--text-primary)]"
          style={{ borderColor: "#cdbda6" }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "var(--text-primary)")
          }
          onBlur={(e) => (e.currentTarget.style.borderColor = "#cdbda6")}
        />
        {trailing && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[color:var(--text-primary)]">
            {trailing}
          </div>
        )}
      </div>
    </div>
  );
}
