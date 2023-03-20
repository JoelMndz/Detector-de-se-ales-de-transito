import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
import base64
from io import BytesIO
from PIL import Image
from pymongo import MongoClient
import cloudinary
import cloudinary.uploader
from bson.objectid import ObjectId
import numpy as np
from keras.models import load_model

# Configurar Cloudinary
cloudinary.config(
  cloud_name = "deendynck",
  api_key = "568685432887794",
  api_secret = "API_SECRET"
)

client = MongoClient("mongodb+srv://admin:admin@cluster0.y0jnakq.mongodb.net/?retryWrites=true&w=majority")
db = client.dbProyecto

modelo = load_model('modelo.h5')

clases = { 1:'Límite de velocidad (20km/h)',
            2:'Límite de velocidad (30km/h)',      
            3:'Límite de velocidad (50km/h)',       
            4:'Límite de velocidad (60km/h)',      
            5:'Límite de velocidad (70km/h)',    
            6:'Límite de velocidad (80km/h)',      
            7:'Fin del límite de velocidad (80km/h)',     
            8:'Límite de velocidad (100km/h)',    
            9:'Límite de velocidad (120km/h)',     
           10:'Prohibido adelantar',   
           11:'Prohibido adelantar vehículos de más de 3.5 toneladas',     
           12:'Ceder el paso en intersección',     
           13:'Vía prioritaria',    
           14:'Ceda el paso',     
           15:'Alto',       
           16:'Prohibido el paso de todo tipo de vehículos',       
           17:'Prohibido el paso a vehículos de más de 3.5 toneladas',       
           18:'Prohibido el acceso',       
           19:'Precaución',     
           20:'Curva peligrosa a la izquierda',      
           21:'Curva peligrosa a la derecha',   
           22:'Curva doble peligrosa',      
           23:'Camino en mal estado',     
           24:'Camino resbaladizo',       
           25:'Estrechamiento de la vía a la derecha',  
           26:'Obras en la vía',    
           27:'Semáforos',      
           28:'Cruce de peatones',     
           29:'Cruce de niños',     
           30:'Cruce de bicicletas',       
           31:'Peligro de hielo/nieve',
           32:'Cruce de animales salvajes',      
           33:'Fin de límite de velocidad + adelantamiento',      
           34:'Girar a la derecha',     
           35:'Girar a la izquierda',       
           36:'Solo seguir adelante',      
           37:'Seguir adelante o a la derecha',      
           38:'Seguir adelante o a la izquierda',      
           39:'Mantenerse a la derecha',     
           40:'Mantenerse a la izquierda',      
           41:'Rótulo de ceda el paso obligatorio',     
           42:'Fin de la prohibición de adelantar',      
           43:'Fin de la prohibición de adelantar vehículos de más de 3.5 toneladas'
}

def predecir(foto):
    image_data = base64.b64decode(foto)
    imagen = Image.open(BytesIO(image_data))
    imagen = imagen.resize((30,30))
    imagen = np.expand_dims(imagen, axis=0)
    imagen = np.array(imagen)
    print(imagen.shape)
    prediccion = modelo.predict([imagen])
    clase = np.argmax(prediccion)
    return {"clase":clases[clase+1]}

def iniciarSesion(user, password):    
    resultado = db.usuarios.find({"user":user,"password":password})
    for i in resultado:
        return {"user":i["user"]}
    raise Exception('Credenciales incorrectas!')

def guardarImagen(nombre, descripcion, base64):
    result = cloudinary.uploader.upload(base64)
    # Imprimir la URL de la imagen cargada
    db.imagenes.insert_one({"nombre":nombre,"descripcion":descripcion, "url": result["secure_url"]})
    return {}

def obtenerImagenes():
    resultado = db.imagenes.find()
    data = [{"_id":i['_id'].__str__(), "nombre":i['nombre'], "descripcion":i['descripcion'], "url":i['url']} for i in resultado]
    return data

def eliminar(id):
    resultado = db.imagenes.delete_one({"_id": ObjectId(id)})
    print(resultado)
    return {"_id": id}