from flask import Flask,request,make_response
from flask_cors import CORS
from servicios import predecir, iniciarSesion, guardarImagen, obtenerImagenes, eliminar
app = Flask(__name__)
CORS(app)


@app.route("/predecir",methods=['POST'])
def index():
  try:
    if 'imagenBase64' not in request.json:
      raise Exception('Debe enviar el atributo imagenBase64')
    data = request.json['imagenBase64']
    data = predecir(request.json['imagenBase64'])
    return make_response(data,200)
  except Exception as error:
    return make_response({'error':'Imagen no soportada'},400)


@app.route("/login",methods=['POST'])
def login():
  try:
    if 'user' not in request.json:
      raise Exception('Debe enviar el user')
    if 'password' not in request.json:
      raise Exception('Debe enviar el password')
    respuesta = iniciarSesion(request.json['user'], request.json['password'])
    return make_response(respuesta,200)
  except Exception as error:
    return make_response({'error':error.__str__()},400)
  

@app.route("/imagen",methods=['POST'])
def postImagen():
  try:
    respuesta = guardarImagen(request.json['nombre'], request.json['descripcion'], request.json['base64'])
    return make_response(respuesta,200)
  except Exception as error:
    print(error)
    return make_response({'error':error.__str__()},400)


@app.route("/imagen",methods=['GET'])
def getImagenes():
  try:
    respuesta = obtenerImagenes()
    return make_response({"data":respuesta},200)
  except Exception as error:
    return make_response({'error':error.__str__()},400)


@app.route("/imagen/<id>",methods=['DELETE'])
def deleteImagenes(id):
  try:
    respuesta = eliminar(id)
    return make_response({"data":respuesta},200)
  except Exception as error:
    return make_response({'error':error.__str__()},400)


if __name__ == "__main__":
  app.run(debug=True)