import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../db/firebase";
const coleccion = "Categorias";
const rutaFoto = "categorias-imagenes";

/* CREAR UNA CATEGORIA SIN IMAGEN */
export const categoriaCrearSF = async (formCategoria, url) => {
  try {
    await addDoc(collection(db, coleccion), {
      Nombre: formCategoria.nombre,
      UrlCategoria: formCategoria.urlCategoria,
      Descripcion: formCategoria.descripcion,
      ImagenUrl: url === undefined ? null : url,
    });
  } catch (e) {
    console.error("Error al agregar categoria ", e);
  }
};

/* SUBIR UNA IMAGEN*/
export const categoriaCrearCF = (formCategoria, foto) => {
  const fechaAhora = Date.now();
  const rutaCompleta = foto.name + fechaAhora + foto.lastModified + foto.size;
  const storage = getStorage();
  const imageRef = ref(storage, `${rutaFoto}/${rutaCompleta}`);
  uploadBytes(imageRef, foto)
    .then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        categoriaCrearSF(formCategoria, url);
      });
    })
    .catch((error) => {
      console.error("Error al subir iamgen", error);
    });
};

/* ELIMINAR UNA ETIQUETA */
export const categoriaEliminar = async (idCategoria) => {
  await deleteDoc(doc(db, coleccion, idCategoria));
};

/* TRAER UN DOCUMENTO*/
export const categoriaUna = async (idCategoria) => {
  const categoriaRef = doc(db, coleccion, idCategoria);
  const docCategoria = await getDoc(categoriaRef);
  if (docCategoria.exists()) {
    return docCategoria.data();
  } else {
    console.log("No existe el documento");
  }
};

/* TRAER UN DOCUMENTO*/
export const categoriasTodas = async () => {
  const categoriaRef = collection(db, coleccion);
  const categoriasDB = await getDocs(categoriaRef);
  return categoriasDB.docs.map((doc) => {
    const id = doc.id;
    return {
      IdCategoria: id,
      Nombre: doc.data().Nombre,
    };
  });
};

/* EDITAR UNA CATEGORIA SIN IMAGEN */
export const categoriaEditarSF = async (formCategoria, url) => {
  const categoriaRef = doc(db, coleccion, formCategoria.idCategoria);
  await updateDoc(categoriaRef, {
    Nombre: formCategoria.nombre,
    UrlCategoria: formCategoria.urlCategoria,
    Descripcion: formCategoria.descripcion,
    ImagenUrl: url === undefined ? null : url,
  });
};

export const categoriaEditarCF = (formCategoria, foto) => {
  const fechaAhora = Date.now();
  const rutaCompleta = foto.name + fechaAhora + foto.lastModified + foto.size;
  const storage = getStorage();
  const imageRef = ref(storage, `${rutaFoto}/${rutaCompleta}`);
  uploadBytes(imageRef, foto)
    .then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        categoriaEditarSF(formCategoria, url);
      });
    })
    .catch((error) => {
      console.error("Error al subir iamgen", error);
    });
};
