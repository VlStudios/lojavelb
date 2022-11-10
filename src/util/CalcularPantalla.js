import { useState, useEffect } from "react";

export default function CalcularPantalla() {
  const [tamanoPantalla, setTamanoPantalla] = useState({
    ancho: undefined,
    alto: undefined,
  });

  useEffect(() => {
    function cambiarTamano() {
      setTamanoPantalla({
        ancho: window.innerWidth,
        alto: window.innerHeight,
      });
    }

    window.addEventListener("resize", cambiarTamano);

    cambiarTamano();

    return () => window.removeEventListener("resize", cambiarTamano);
  }, []);
  return tamanoPantalla;
}
