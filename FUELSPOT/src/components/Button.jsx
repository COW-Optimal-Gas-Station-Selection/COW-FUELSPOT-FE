
function Button({ children, ...props }) {
  return (
    <button
      className="h-9 px-4 bg-black rounded-lg text-white text-sm font-normal leading-5 hover:bg-gray-800 transition-colors cursor-pointer"
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
