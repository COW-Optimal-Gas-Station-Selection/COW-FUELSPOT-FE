
export default function FuelspotLogo({ className = '', ...props }) {
  return (
    <img
      src="/logo-fuelspot.png"
      alt="FUELSPOT Logo"
      className={"h-18 w-auto " + className}
      {...props}
    />
  );
}
