import { doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../db/firebase";
const coleccion = "Clientes";
const rutaFoto = "perfil-imagenes";

export const editarPerfilSoloDatos = async (formCliente, genero) => {
  const perfilRef = doc(db, coleccion, formCliente.idCliente);

  await updateDoc(perfilRef, {
    Nombres: formCliente.nombres,
    Apellidos: formCliente.apellidos,
    Celular: formCliente.celular,
    FechaNacimiento: formCliente.fechaNacimiento,
    Genero: genero    
  });
};

export const editarPerfilSinFoto = async (url, IdCliente) => {
  const perfilRef = doc(db, coleccion, IdCliente);
  await updateDoc(perfilRef, {
    FotoUrl: url === undefined ? null : url,
    
  });
};

export const editarPerfilConFoto = (foto, IdCliente) => {
  const fechaAhora = Date.now();
  const rutaCompleta = foto.name + fechaAhora + foto.lastModified + foto.size;
  const storage = getStorage();
  const imageRef = ref(storage, `${rutaFoto}/${rutaCompleta}`);
  uploadBytes(imageRef, foto)
    .then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        editarPerfilSinFoto(url, IdCliente);
      });
    })
    .catch((error) => {
      console.error("Error al subir imagen", error);
    });
};