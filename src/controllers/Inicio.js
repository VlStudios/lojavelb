import { collection, getDocs } from "firebase/firestore";
import { db } from "../db/firebase";

const coleccion = "Productos";

/* TRAER TODOS LOS PRODUCTOS*/
export const todosProductos = async () => {
  const productosRef = collection(db, coleccion);
  const productosDB = await getDocs(productosRef);
  return productosDB.docs.map((doc) => {
    return {
      IdProducto: doc.id,
      ...doc.data(),
    };
  });
};
