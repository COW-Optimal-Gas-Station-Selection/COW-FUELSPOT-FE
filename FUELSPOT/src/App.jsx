
import { useState } from 'react';
import './App.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

import FuelPriceBox, { FUEL_TYPE } from './components/FuelPriceBox';
import GasBrandIconBox from './components/GasBrandIconBox';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* ...existing code... */}
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      {/* Demo: FuelPriceBox and GasBrandIconBox */}
      <div className="flex flex-col items-center gap-4 mt-8">
        <div className="flex gap-4">
          <FuelPriceBox fuelType={FUEL_TYPE.GASOLINE} price={1750} />
          <FuelPriceBox fuelType={FUEL_TYPE.DIESEL} price={1550} />
          <FuelPriceBox fuelType={FUEL_TYPE.PREMIUM} price={1950} />
        </div>
        <div className="flex gap-4">
          <GasBrandIconBox brand="현대오일뱅크" />
          <GasBrandIconBox brand="S-OIL" />
          <GasBrandIconBox brand="알뜰주유소" />
        </div>
      </div>
    </>
  )
}

export default App
