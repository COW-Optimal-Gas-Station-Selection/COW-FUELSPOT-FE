export default function MyPageTitle({ title, color = "blue-600" }) {
  const bgClass = `bg-${color}`;
  return (
    <h2 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2">
      <span className={`w-1.5 h-6 ${bgClass} rounded-full`}></span>
      {title}
    </h2>
  );
}
