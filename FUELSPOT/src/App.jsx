import Button from './components/Button'
import Input from './components/Input'
import PrimitiveButton from './components/PrimitiveButton'

function App() {
  return (
    <div className="p-8 space-y-4">
      <div className="w-64">
        <Button />
      </div>
      <div className="w-64">
        <Input />
      </div>
      <div className="w-64">
        <PrimitiveButton />
      </div>
    </div>
  )
}

export default App
