import { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  InputAdornment,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { useImageContext } from 'src/contexts/images';


export const FormImagen = ({setShow}) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [file, setFile] = useState(null);

  const {agregarImagen} = useImageContext();

  const handleSubmit = async(event) => {
      event.preventDefault();
      if(!nombre || !descripcion || !file){
        alert('Llene todos los campos!')
        return;
      }
      await agregarImagen({nombre,descripcion,file});
      setShow(false);
    };

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Card>
        <CardHeader
          title="Agregar Imagen"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Nombre"
                  onChange={(e)=> setNombre(e.target.value)}
                  required
                  value={nombre}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Descripcion"
                  onChange={(e)=> setDescripcion(e.target.value)}
                  required
                  value={descripcion}
                />
              </Grid>
              
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  type="file"
                  label="Imagen"
                  onChange={(e)=> setFile(e.target.files?.item(0))}
                  required
                  sx={{marginTop:1}}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        📷
                      </InputAdornment>
                    ),
                    style: {
                      color: 'white',
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button 
            type='submit'
            variant="contained">
            Guardar
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
