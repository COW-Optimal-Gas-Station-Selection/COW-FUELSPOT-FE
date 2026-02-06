
export default function FuelspotLogo({ className = '', ...props }) {
  return (
    <img
      src="/logo-fuelspot.png"
      alt="FUELSPOT Logo"
      className={"h-16 w-auto " + className}
      {...props}
    />
  );
}
