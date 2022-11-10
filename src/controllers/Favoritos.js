import {
  collection,
  doc,
  deleteDoc,
  addDoc,
  updateDoc,
  getDocs,
  setDoc
} from "firebase/firestore";
import { db } from "../db/firebase";
const coleccion = "Clientes";
const subColeccion = "Favoritos";

export const favoritosTodos = async (IdCliente) => {
  const favoritosRef = collection(db, coleccion, IdCliente, subColeccion);
  const favoritosDB = await getDocs(favoritosRef);
  return favoritosDB.docs.map((doc) => {
    const id = doc.id;
    return {
      IdProducto: id,
      ...doc.data(),
    };
  });
};

export const favoritoAgregar = async (IdCliente, producto) => {
  const rrutaFavorito = `${coleccion}/${IdCliente}/${subColeccion}`;
  const favoritosRef = doc(db, rrutaFavorito, producto.IdProducto);
  try {
    await setDoc(favoritosRef, {
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

export const favoritoCrear = async (IdCliente, product) => {
  const favoritosRef = collection(db, coleccion, IdCliente, subColeccion);
  try {
    await addDoc(favoritosRef, {
      Nombre: product.Nombre,
      Precio: product.Precio,
      ImagenesUrl: product.ImagenesUrl[0],
      IdProducto: product.IdProducto,
      UrlProducto: product.UrlProducto
    });
  } catch (e) {
    console.error("No se pudo agregar favorito ", e);
  }
};

export const favoritoEditar = async (IdCliente, favorito) => {
  const rrutaFavorito = `${coleccion}/${IdCliente}/${subColeccion}`;
  const favoritosRef = doc(db, rrutaFavorito, favorito.idFavorito);
  await updateDoc(favoritosRef, {
    Nombre: favorito.nombre,
  });
};

export const favoritoEliminar = async (IdCliente, idFavorito) => {
  const rrutaFavorito = `${coleccion}/${IdCliente}/${subColeccion}`;
  const favoritosRef = doc(db, rrutaFavorito, idFavorito);
  await deleteDoc(favoritosRef);
};
