export const convertirBase64 = (archivo, completo=false)=> new Promise((resolve, reject)=>{
  if(!archivo){
    resolve(null);
    return;
  }
  const reader = new FileReader();
  reader.onloadend = () => {
    let base64 = reader.result.toString();
    if(!completo){
      base64 = base64.split(',')[1];
    }
    resolve(base64)
  };
  reader.onerror = error => reject(error);
  reader.readAsDataURL(archivo);
});