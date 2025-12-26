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


function ListaTareasPersistente() {

  const [nuevoTexto, setNuevoTexto] = useState("");
  const [listaTareas, setListaTareas] = useLocalStorage('listaTareas', [
    {id: 0, tarea: "primera tarea", completada: false},
    {id: 1, tarea: "segunda tarea", completada: false},
    {id: 2, tarea: "tercera tarea", completada: false}
  ]);

  const agregarTarea = () => {
    if (nuevoTexto === "") return; // Evitar agregar tareas vacías
    
    const nuevaTarea = {
      id: Date.now(), // fecha como id.
      tarea: nuevoTexto,
      completada: false
    };
    //Actualizar la lista 
    setListaTareas([...listaTareas, nuevaTarea]); // operador spread "..." funciona como un append
    setNuevoTexto("");
  };

  return (
    <div className="tarjeta-listaTareas">
      <h3>Lista de tareas:</h3>
      <div className="lista">
        {listaTareas.map((item) => (
          <div key={item.id} className="item-tarea">
            {/* {CHECKBOX} */}
            <span>{item.tarea}</span>
          </div> 
        ))}
      </div>

      <input className="input-tareas" 
        value={nuevoTexto}                              
        onChange={(e) => setNuevoTexto(e.target.value)} 
        placeholder="Nueva tarea..." />
      <button onClick={agregarTarea}>Agregar</button>
    </div>
  ); 
}

function App() {
  
  return (
    <>
      <h1>Tarea n° 5: Lista de tareas con Hooks</h1>
      <div className="componentes">
        <ListaTareasPersistente/>
      </div>
    </>
  )
}

export default App
