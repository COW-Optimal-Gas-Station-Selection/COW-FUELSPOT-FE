// A simple SVG for a user location icon
export default function MyLocationIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="10" fill="#2563eb" fillOpacity="0.2"/>
      <circle cx="16" cy="16" r="5" fill="#2563eb"/>
      <circle cx="16" cy="16" r="2" fill="#fff"/>
    </svg>
  );
}
