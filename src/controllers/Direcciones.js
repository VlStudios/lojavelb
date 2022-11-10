import {
  collection,
  doc,
  deleteDoc,
  setDoc,
  updateDoc,
  getDocs,
  getDoc
} from "firebase/firestore";
import { db } from "../db/firebase";
const coleccion = "Clientes";
const subColeccion = "Direcciones";

export const direccionesTodos = async (IdCliente) => {
  const direccionesRef = collection(db, coleccion, IdCliente, subColeccion);
  const direccionesDB = await getDocs(direccionesRef);
  return direccionesDB.docs.map((doc) => {
    const id = doc.id;
    return {
      IdDireccion: id,
      ...doc.data(),
    };
  });
};

export const direccionCrear = async (
  IdCliente,
  formDireccion,
  direcionEnvio
) => {
  let idEnvio = "grLgeRrHFEyg8g4IUw2J";
  const rrutaDireccion = `${coleccion}/${IdCliente}/${subColeccion}`;
  const direccionesRef = doc(db, rrutaDireccion, idEnvio);
  try {
    await setDoc(direccionesRef, {
      Direccion: formDireccion.direccion,
      Recomendacion: formDireccion.recomendacion,
      Region: direcionEnvio.region,
      Provincia: direcionEnvio.provincia,
      Distrito: direcionEnvio.distrito,
    });
  } catch (e) {
    console.error("No se pudo agregar la dirección ", e);
  }
};

export const direccionEditar = async (IdCliente, formDireccion, direcionEnvio) => {
  let idEnvio = "grLgeRrHFEyg8g4IUw2J";
  const rrutaFavorito = `${coleccion}/${IdCliente}/${subColeccion}`;
  const direccionesRef = doc(db, rrutaFavorito, idEnvio);
  await updateDoc(direccionesRef, {
    Direccion: formDireccion.direccion,
    Recomendacion: formDireccion.recomendacion,
    Region: direcionEnvio.region,
    Provincia: direcionEnvio.provincia,
    Distrito: direcionEnvio.distrito,
  });
};

export const direccionEliminar = async (IdCliente, idDireccion) => {
  const rrutaFavorito = `${coleccion}/${IdCliente}/${subColeccion}`;
  const direccionesRef = doc(db, rrutaFavorito, idDireccion);
  await deleteDoc(direccionesRef);
};

export const direccionTraerUno = async (IdCliente) => {
  let idEnvio = "grLgeRrHFEyg8g4IUw2J";
  const rrutaFavorito = `${coleccion}/${IdCliente}/${subColeccion}`;
  const direccionesRef = doc(db, rrutaFavorito, idEnvio);
  const docDireccion = await getDoc(direccionesRef);
  if (docDireccion.exists()) {
    return docDireccion.data();
  } else {
    console.log("No existe el documento");
  }
};