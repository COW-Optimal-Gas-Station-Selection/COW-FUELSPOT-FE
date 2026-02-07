
export default function FuelspotLogo({ className = '', ...props }) {
  return (
    <img
      src="/FUELSPOT.png"
      alt="FUELSPOT Logo"
      className={"h-16 w-auto " + className}
      {...props}
    />
  );
}
