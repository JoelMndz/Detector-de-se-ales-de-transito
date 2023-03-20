import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';
import { useState } from 'react';
import Axios, { AxiosError } from 'axios';
import {convertirBase64} from '../../utils/convetirBase64'

const user = {
  avatar: '/assets/avatars/avatar-anika-visser.png',
  city: 'Los Angeles',
  country: 'USA',
  jobTitle: 'Senior Developer',
  name: 'Anika Visser',
  timezone: 'GTM-7'
};

const API = 'http://localhost:5000/predecir';

export const AccountProfile = () =>{
  const [archivo, setArchivo] = useState(null);
  const [descripcion, setDescripcion] = useState('');

  const sendImage = async(x)=>{
    const base64 = await convertirBase64(x);
    setDescripcion('---')
    await Axios({
      url:API,
      method:'POST',
      data:{
        'imagenBase64':base64
      }
    })
      .then(x =>{
        setDescripcion(x.data.clase);
      })
      .catch((x)=>{
        setDescripcion(x.response.data.error)
      })   
  }

  const changeImage = async(event)=>{
    if(event.target.files && event.target.files.length == 1){
      setArchivo(event.target.files?.item(0));
      await sendImage(event.target.files?.item(0));
    }else{
      setArchivo(null);
      setDescripcion('Resultado!')
    }
  }

  return(
  <Card>
    <CardContent>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {archivo && <Avatar
          src={URL.createObjectURL(archivo)}
          sx={{
            height: 200,
            mb: 2,
            width: 200
          }}
        />}
        <Typography
          gutterBottom
          variant="h5"
        >
          {descripcion}
        </Typography>
      </Box>
    </CardContent>
    <Divider />
    <CardActions>
      <Button
        fullWidth
        variant="text"
        component="label"
      >
        Escoja la imagen
        <input hidden accept="image/*" type="file" onChange={changeImage}/>
      </Button>
    </CardActions>
  </Card>
  );
}
