import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  collectionGroup,
  where
} from "firebase/firestore";
import { db } from "../db/firebase";
const coleccion = "Clientes";
const subColeccion = "Pedidos";

export const pedidosTodos = async (IdCliente) => {
  const pedidosRef = collection(db, coleccion, IdCliente, subColeccion);
  const queryPedidos = query(pedidosRef, orderBy("Fecha", "desc"));
  const pedidosDB = await getDocs(queryPedidos);
  const resultado = pedidosDB.docs.map((doc) => ({
    IdPedido: doc.id,
    ...doc.data(),
  }));
  return resultado;
};

export const pedidoCrear = async (carritoDB) => {
  console.log("ENVIADO: ", carritoDB);
  const idPedido = `00 + ${Date.now()}`;
  const rrutaPedido = `${coleccion}/${carritoDB.IdCliente}/${subColeccion}`;
  const pedidosRef = doc(db, rrutaPedido, idPedido); 
  try {
    await addDoc(pedidosRef, {
      Total: carritoDB.Total,
      Productos: carritoDB.Productos,
      Direccion: carritoDB.Direccion,
      Fecha: new Date(),
      IdCliente: carritoDB.IdCliente,
      Nombres: carritoDB.Nombres,
      Apellidos: carritoDB.Apellidos,
      Correo: carritoDB.Correo,
      Celular: carritoDB.Celular,
      Estado: "pedido",
      NumeroPedido: idPedido,
    });
    console.log("PEDIDO AGREGADO ");
  } catch (e) {
    console.error("No se pudo crear el pedido ", e);
  }
};

export const pedidosGeneral = async () => {
  const pedidosRef = collectionGroup(db, "Pedidos");
  const pedidosDB = await getDocs(pedidosRef);
  var pedidosArray = [];
  pedidosDB.forEach((doc) => {
    pedidosArray.push({ IdPedido: doc.id, ...doc.data() });
  });
  return pedidosArray;
};

export const pedidoEditar = async (IdCliente, IdPedido, estado) => {
  const rrutaFavorito = `${coleccion}/${IdCliente}/${subColeccion}`;
  const favoritosRef = doc(db, rrutaFavorito, IdPedido);
  await updateDoc(favoritosRef, {
    Estado: estado,
  });
};

export const pedidoUno = async (numeroPedido) => {
  const pedidosRef = collectionGroup(db, "Pedidos");
  const pedidosDB = await getDocs(pedidosRef);
  var pedidosArray = [];
  pedidosDB.forEach((doc) => {
    pedidosArray.push({ IdPedido: doc.id, ...doc.data() });
  });
  const unPedido = pedidosArray.filter(pedido => pedido.IdPedido === numeroPedido);
  return unPedido[0];
};

export const pedidoUnoIgual = async (numeroPedido) => {
  const pedidosRef = collectionGroup(db, "Pedidos");
  const queryPedido = query(pedidosRef, where('NumeroPedido', '==', numeroPedido)) 
  const pedidosDB = await getDocs(queryPedido);
  var pedidosArray = [];
  pedidosDB.forEach((doc) => {
    pedidosArray.push({ IdPedido: doc.id, ...doc.data() });
  });
  return pedidosArray[0];
};