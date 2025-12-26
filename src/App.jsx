import { useState, useEffect, useRef } from 'react'
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

  const inputRef = useRef(null);
  const [nuevoTexto, setNuevoTexto] = useState("");
  const DATOS_INICIALES = [
    {id: 0, tarea: "primera tarea", completada: false},
    {id: 1, tarea: "segunda tarea", completada: false},
    {id: 2, tarea: "tercera tarea", completada: false}
  ];

  const [listaTareas, setListaTareas] = useLocalStorage('listaTareas', DATOS_INICIALES);

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
    inputRef.current.focus(); // useRef para volver a escribir al hacer click en agregar.
  };
  
  const toogleTarea = (id) => {
    
    const nuevaLista = listaTareas.map((tarea) => {
    if (tarea.id === id) {
      return { ...tarea, completada: !tarea.completada };
    } else {
      return tarea;
    }
  });

  setListaTareas(nuevaLista);  
  }

  const restablecerTareas = () => {
    setListaTareas(DATOS_INICIALES);
  };

  return (
    <div className="tarjeta-listaTareas">
      <h3>Lista de tareas:</h3>
      
      <input className="input-tareas"
        ref={inputRef} 
        value={nuevoTexto}                              
        onChange={(e) => setNuevoTexto(e.target.value)} 
        placeholder="Nueva tarea..." 
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            agregarTarea();
          }
        }}/>
      <button onClick={agregarTarea}>Agregar</button>
      <button onClick={restablecerTareas}>Restablecer</button>
      <div className="lista">
        <ol>
          {listaTareas.map((item) => (
            <li key={item.id} className="item-tarea">
            
              <input type="checkbox" checked={item.completada} onClick={() => toogleTarea(item.id)} />
              <span>{item.tarea}</span>
                
            </li> 
          ))} 
        </ol> 
      </div>

      
    </div>
  ); 
}

function App() {
  
  return (
    <>
      <h1>Tarea n° 5: Lista de tareas con Hooks</h1>
      <div className="componentes">
        <ListaTareasPersistente/>
        {/* <ListaTareasPersistente/>
        <ListaTareasPersistente/> */}

      </div>
    </>
  )
}

export default App
