import {
  collection,
  getDocs,
  getFirestore,
  collectionGroup,
} from "firebase/firestore";
const db = getFirestore();

const coleccionProductos = "Productos";
const coleccionClientes = "Clientes";

export const productosTotal = async () => {
  const productosRef = collection(db, coleccionProductos);
  const productosDB = await getDocs(productosRef);
  return productosDB.docs.length;
};

export const clientesTotal = async () => {
  const clientesRef = collection(db, coleccionClientes);
  const clientesDB = await getDocs(clientesRef);
  return clientesDB.docs.length;
};

export const pedidosTotal = async () => {
  const pedidosRef = collectionGroup(db, "Pedidos");
  const pedidosDB = await getDocs(pedidosRef);
  return pedidosDB.docs.length;
};

export const ventasTotal = async () => {
  const ventasRef = collectionGroup(db, "Pedidos");
  const ventasDB = await getDocs(ventasRef);
  var total = 0;
  ventasDB.forEach((doc) => {
    total += doc.data().Total;
  });
  return total;
};
