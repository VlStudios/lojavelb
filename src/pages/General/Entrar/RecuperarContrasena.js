import React, { useState } from "react";
import { Link } from "react-router-dom";
import { recuperarContrasena } from "../../../controllers/Sesion";
import "./Registrar.css";

const RecuperarContrasena = (props) => {
  const [formCorreo, setFormCorreo] = useState("");
  const cambiarDatos = (e) => {
    const value = e.target.value;
    setFormCorreo(value);
  };
  const recuperar = (e) => {
    e.preventDefault();
    recuperarContrasena(formCorreo).then((res) => {
      if (res === "correcto") {
        console.log("Verifique en su correo electrónico");
      } else {
        console.log("Error no se pudo");
      }
    });
    setFormCorreo("");
  };

  return (
    <>
      <div
        style={{
          height: "80vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <form onSubmit={recuperar}  style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          <input
            type="text"
            required
            name="correo"
            placeholder="Correo"
            value={formCorreo}
            onChange={cambiarDatos}
          />
          <p>Escribe tu correo</p>
          <br />
          <input type="submit" value="Recuperar" className="boton-mediano" />
          <br />
          <p>
            Ya me recorde la contraseña
            <Link to="/ingresar"> Ingresar</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default RecuperarContrasena;
