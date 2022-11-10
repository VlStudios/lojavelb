import {
  collection,
  doc,
  deleteDoc,
  getDocs,
  setDoc
} from "firebase/firestore";
import { db } from "../db/firebase";
const coleccion = "Clientes";
const subColeccion = "Guardar";

export const guardadosTodos = async (IdCliente) => {
  const guardadosRef = collection(db, coleccion, IdCliente, subColeccion);
  const guardadosDB = await getDocs(guardadosRef);
  return guardadosDB.docs.map((doc) => {
    const id = doc.id;
    return {
      IdProducto: id,
      ...doc.data(),
    };
  });
};

export const guardarAgregar = async (IdCliente, producto) => {
  const rrutaFavorito = `${coleccion}/${IdCliente}/${subColeccion}`;
  const guardarRef = doc(db, rrutaFavorito, producto.IdProducto);
  try {
    await setDoc(guardarRef, {
      Nombre: producto.Nombre,
      Marca: producto.Marca,
      UrlProducto: producto.UrlProducto,
      Descripcion: producto.Descripcion,
      Precio: producto.Precio,
      Cantidad: producto.Cantidad,
      TiempoEntrega: producto.TiempoEntrega,
      Categoria: producto.Categoria,
      Etiqueta: producto.Etiqueta,
      ImagenesUrl: producto.ImagenesUrl
    });
  } catch (e) {
    console.error("No se pudo agregar favorito ", e);
  }
};


export const guardarEliminar = async (IdCliente, idGuardar) => {
  const rrutaFavorito = `${coleccion}/${IdCliente}/${subColeccion}`;
  const guardarRef = doc(db, rrutaFavorito, idGuardar);
  await deleteDoc(guardarRef);
};
