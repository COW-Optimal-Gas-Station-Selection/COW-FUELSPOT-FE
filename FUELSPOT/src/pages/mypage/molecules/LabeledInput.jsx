import Input from '../../../components/Input';

export default function LabeledInput({ 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  error 
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-bold text-gray-700">{label}</label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
    </div>
  );
}
