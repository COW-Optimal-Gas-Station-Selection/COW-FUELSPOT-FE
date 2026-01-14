function Input({ placeholder = "예: 12.5", value, onChange, ...props }) {
  return (
    <input
      type="text"
      className="w-full h-9 px-3 py-1 bg-zinc-100 rounded-lg outline outline-[0.80px] outline-offset-[-0.80px] outline-black/0 text-neutral-950 text-sm font-normal font-['Arimo'] placeholder:text-gray-500"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
}

export default Input;
