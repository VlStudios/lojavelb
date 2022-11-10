import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
  updateDoc,
  getDocs
} from "firebase/firestore";
import { db } from "../db/firebase";
const coleccion = "Etiquetas";

export const etiquetaTodas = async () => {
  const etiquetaRef = collection(db, coleccion);
  const etiquetasDB = await getDocs(etiquetaRef);
  return etiquetasDB.docs.map((doc) => {
    const id = doc.id;
    return {
      IdEtiqueta: id,
      Nombre: doc.data().Nombre,
    };
  });
};

/* CREAR UNA ETIQUETA */
export const etiquetaCrear = async (formEtiqueta) => {
  try {
    await addDoc(collection(db, coleccion), {
      Nombre: formEtiqueta.nombre,
      UrlEtiqueta: formEtiqueta.urlEtiqueta,
      Descripcion: formEtiqueta.descripcion,
    });
  } catch (e) {
    console.error("No se pudo agregar la etiqueta ", e);
  }
};

/* TRAER TODAS LAS ETIQUETAS EN TIEMPO REAL */
export const etiquetasTodasTR = () => {
  onSnapshot(collection(db, coleccion), (snapshot) => {
    console.log(
      snapshot.docs.map((doc) => ({
        IdEtiqueta: doc.id,
        ...doc.data(),
      }))
    );
  });
};

/* ELIMINAR UNA ETIQUETA */
export const etiquetaEliminar = async (idEtiqueta) => {
  await deleteDoc(doc(db, coleccion, idEtiqueta));
};

/* EDITAR UNA ETIQUETA */
export const etiquetaEditar = async (formEtiqueta) => {
  const etiquetaRef = doc(db, coleccion, formEtiqueta.idEtiqueta);
  await updateDoc(etiquetaRef, {
    Nombre: formEtiqueta.nombre,
    UrlEtiqueta: formEtiqueta.urlEtiqueta,
    Descripcion: formEtiqueta.descripcion,
  });
};
