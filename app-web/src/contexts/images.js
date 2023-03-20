import { createContext, useState,useContext } from 'react'
import Axios from 'axios';
import { convertirBase64 } from '../utils/convetirBase64';

export const ImageContext = createContext(null);

export const useImageContext = ()=>useContext(ImageContext)

export function ImageContextProvider(props) {
  const [imagenes, setImagenes] = useState([]);
  const API = 'http://localhost:5000';

  const obtenerImagenes = async()=>{
    try {
      const respuesta = await Axios({
        url:`${API}/imagen`,
        method:'GET'
      })
      const data = await respuesta.data;
      setImagenes(data.data)      
    } catch (error) {
      console.log(error);
    }
  }

  const agregarImagen = async({nombre, descripcion, file})=>{
    const base64 = await convertirBase64(file,true);
    const respuesta = await Axios({
      url:`${API}/imagen`,
      method: 'POST',
      data:{
        nombre: nombre,
        descripcion: descripcion,
        base64
      }
    });
    if(respuesta.status == 200){
      await obtenerImagenes();
    }
  }

  const eliminarImagen = async(id) =>{
    const respuesta = await Axios({
      url:`${API}/imagen/${id}`,
      method:'DELETE'
    })
    if(respuesta.status == 200){
      setImagenes(imagenes.filter((x) => x._id !== id))
    }
  }

  
  return (<ImageContext.Provider 
    value={{
      imagenes,
      obtenerImagenes,
      eliminarImagen,
      agregarImagen
    }}>
    {props.children}
  </ImageContext.Provider>);
}
