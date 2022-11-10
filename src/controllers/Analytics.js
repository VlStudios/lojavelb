import { analytics } from "../db/firebase";
import { logEvent, setUserProperties } from "firebase/analytics";

export const visitasPaginas = (nombre) => {
  logEvent(analytics, nombre);
};

export const eventosClick = (total) => {
  setUserProperties(analytics, { flujo_dinero: total });
};
