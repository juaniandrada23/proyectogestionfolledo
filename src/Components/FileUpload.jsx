import React, { useState } from 'react';
import { storage } from '../Firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { MdAddAPhoto, MdOutlineCancel } from "react-icons/md";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

const FileUpload = ({ nombreDeUsuario, idUsuario, cargarDatos, fetchData}) => {
  const apiUrl = process.env.REACT_APP_APIURL;
  const [imageUpload, setImageUpload] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const abrirModalFoto = () => {
    setModalOpen(true);
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      setImageUpload(selectedImage);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    } else {
      setImageUpload(null);
      setPreviewUrl(null);
    }
  };

  const cancelUpload = () => {
    setImageUpload(null);
    setPreviewUrl(null);
    // Limpiar el valor del input file
    document.getElementById('fileInput').value = '';
  };

  const uploadImage = () => {
    setIsLoading(true);

    if (imageUpload === null) return;
  
    const imageRef = ref(
      storage,
      `balancesFOLLEDO/Usuarios/${nombreDeUsuario}/${imageUpload.name}`
    );
  
    uploadBytes(imageRef, imageUpload).then(() => {
    
      // Obtén la URL de la imagen subida en Firebase
      getDownloadURL(imageRef).then((downloadURL) => {
        // Codifica la URL antes de enviarla a la API
        const encodedURL = encodeURIComponent(downloadURL);
    
        // Llama a la API para actualizar la imagen en la base de datos
        fetch(`${apiUrl}/usuarios/actualizarimagen?imagen=${encodedURL}&idUsuario=${idUsuario}`, {
          method: 'PUT',
        })
          .then(response => {
            if (response.ok) {
              cargarDatos();
              fetchData();
              setModalOpen(false);
              setIsLoading(false);
              console.log('Imagen actualizada correctamente en la base de datos');
            } else {
              console.error('Error al modificar la imagen en la base de datos');
            }
          })
          .catch(error => console.error('Error al modificar la imagen en la base de datos', error));
      });
    
      // Restablecer estados y limpiar el valor del input file
      setImageUpload(null);
      setPreviewUrl(null);
    });
  };

  return (
    <>
      <button onClick={() => abrirModalFoto()} style={{borderRadius:'10px', display:'flex', flexDirection:'row', alignItems:'center', gap:'10px'}} className="block mx-auto px-4 font-semibold text-white py-1 sm:px-4 sm:py-2 transition ease-in-out delay-150 bg-[#006989] hover:bg-[#053F61] duration-300">
        Cambiar Foto
        <MdAddAPhoto/>
      </button>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle style={{ backgroundColor: '#006989', color: 'white', marginBottom: '5px' }} id="alert-dialog-title">
          Cambiar foto de perfil
        </DialogTitle>
        <DialogContent>
          {previewUrl && (
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <img src={previewUrl} alt="Preview" style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} />
              <button className='pt-1 pr-1' onClick={cancelUpload} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#333' }}>
                <MdOutlineCancel style={{width:'5vh', height:'5vh', color:'black', backgroundColor:'white', borderRadius:'50px'}}/>
              </button>
            </div>
          )}
          
          {/* Sección "Agrega una imagen" condicional */}
          {!previewUrl && (
            <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', background: '#f9f9f9' }}>
              <p className='text-center' style={{ margin: '0', color: '#333', fontWeight: 'bold' }}>Agrega una imagen</p>
              <p style={{ margin: '0', color: '#777' }}>Selecciona o carga tu foto de perfil</p>
            </div>
          )}

          <input id="fileInput" type="file" onChange={handleImageChange} style={{ display: 'none' }}/>
          <label htmlFor="fileInput" className="rounded-2xl mx-20 flex justify-center px-4 font-semibold text-white py-1 sm:px-4 sm:py-2 transition ease-in-out delay-75 hover:-translate-y-1 bg-[#006989] hover:bg-[#053F61] duration-300">
            Selecciona
          </label>
          <div style={{display:'flex', justifyContent:'center', marginTop:'10px'}}>
              {!isLoading && (
                <Button variant="contained" color="success" onClick={uploadImage} disabled={!previewUrl}>
                  Actualizar
                </Button>
              )}
              {isLoading && <CircularProgress color="success" />}
          </div>
          
        </DialogContent>
        <DialogActions style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}></DialogActions>
      </Dialog>


    </>
  );
};

export default FileUpload;
