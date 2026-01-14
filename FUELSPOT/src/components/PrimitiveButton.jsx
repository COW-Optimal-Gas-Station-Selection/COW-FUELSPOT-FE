function PrimitiveButton({
  options = ["휘발유", "경유", "LPG"],
  defaultValue = "휘발유",
  onChange,
  ...props
}) {
  const optionStyle = {
    backgroundColor: "#f4f4f5",
    color: "#0f172a",
  };

  return (
    <div
      className="w-full h-9 px-3 bg-zinc-100 rounded-lg outline outline-[0.80px] outline-offset-[-0.80px] outline-black/0 flex items-center hover:bg-zinc-200 transition-colors relative"
      {...props}
    >
      <select
        className="w-full h-full bg-transparent text-neutral-950 text-sm font-normal font-['Arimo'] leading-5 pr-6 appearance-none cursor-pointer focus:outline-none focus:ring-0 border-none"
        defaultValue={defaultValue}
        onChange={onChange}
        style={{ border: "none", outline: "none" }}
      >
        {options.map((opt) => (
          <option
            key={opt}
            value={opt}
            style={optionStyle}
          >
            {opt}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 flex items-center opacity-50">
        <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L4 4L7 1" stroke="#6B7280" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

export default PrimitiveButton;
