import { useState, useEffect } from 'react'
import './App.css'

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoreValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error("Error al intentar leer localStorage", error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      const valueToStore = typeof storedValue === 'function' ? storedValue(storedValue) : storedValue
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error("Error al intentar guardar en localStorage", error)
    }
  }, [key, storedValue])

  return [storedValue, setStoreValue]
}


function ContadorPersistente() {
  const [contador, setContador] = useLocalStorage('contador', 0);

  return(
    <div className="tarjeta-contador">
      <p className="texto-contador">contador: {contador}</p>
      <div className="botones-contador">
        <button onClick={() => setContador(contador +1) }> Incrementar</button>
        <button onClick={() => setContador(0) }> Resetear</button>
      </div>
    </div>
  )
}

function App() {
  
  return (
    <>
      <h2>Test</h2>
      <ContadorPersistente/>
    </>
  )
}

export default App
