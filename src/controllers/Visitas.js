import { doc, setDoc, increment, updateDoc } from "firebase/firestore";
import { db } from "../db/firebase";
const coleccion = "Visitas";

export const actualizarVisitas = async (fechaID) => {
  try {
    await updateDoc(doc(db, coleccion, fechaID), {
      Cantidad: increment(1),
    });
  } catch (e) {
    await setDoc(doc(db, coleccion, fechaID), {
      Cantidad: increment(1),
      Fecha: new Date(),
    });
  }
};
