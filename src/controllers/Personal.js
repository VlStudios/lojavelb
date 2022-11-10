import { addDoc, collection } from "firebase/firestore";
import { db } from "../db/firebase";
const coleccion = "Personales";

export const personalCrear = async (
  formPersonal,
  categoriaSelect,
) => {
  try {
    await addDoc(collection(db, coleccion), {
      Nombres: formPersonal.nombres,
      Celular: formPersonal.celular,
      Correo: formPersonal.correo,
      Rol: categoriaSelect,
    });
  } catch (e) {
    console.error("Error al registrar personal ", e);
  }
};