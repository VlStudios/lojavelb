import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  verificarCuentaCorreo,
  actualizarCuentaContrasena,
} from "../../../controllers/Sesion";

const Verificar = () => {
  const [confirmarCorreo, setConfirmarCorreo] = useState("esperando");
  const [correoCliente, setCorreoCliente] = useState("");
  const [formContrasena, setFormContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("esperando");

  const cambiarDatos = (e) => {
    const value = e.target.value;
    setFormContrasena(value);
  };

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  let query = useQuery();
  let codigoVerificacion = query.get("oobCode");
  let modoVerificacion = query.get("mode");

  useEffect(() => {
    if (codigoVerificacion !== null && modoVerificacion === "verifyEmail") {
      verificarCuentaCorreo(codigoVerificacion).then((res) => {
        if (res === "error") {
          setConfirmarCorreo("error");
        } else if (res === "expirado") {
          setConfirmarCorreo("expirado");
        } else {
          setConfirmarCorreo("correcto");
          setCorreoCliente(res);
        }
      });
    }
  }, [codigoVerificacion, modoVerificacion]);

  const actualizarContrasena = (e) => {
    e.preventDefault();
    actualizarCuentaContrasena(codigoVerificacion, formContrasena).then(
      (res) => {
        if (res === "cambiado") {
          setConfirmarContrasena("cambiado");
        } else if (res === "no") {
          setConfirmarContrasena("no");
        } else {
          setConfirmarContrasena("error");
        }
      }
    );
  };

  return (
    <div
      style={{
        height: "80vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {modoVerificacion === "verifyEmail" && (
        <div>
          <p>Esperando confirmación del correo:</p>
          {confirmarCorreo === "esperando" && <h3>Procesando....</h3>}
          {confirmarCorreo === "error" && <h3>Error en la confirmación</h3>}
          {confirmarCorreo === "expirado" && (
            <h3>Codigo de verificación expirado</h3>
          )}
          {confirmarCorreo === "correcto" && (
            <>
              <h3>
                Bienvenido ya esta verificado puede iniciar sesión con tu
                correo: {correoCliente}{" "}
              </h3>
              <Link to="/ingresar">Iniciar sesión</Link>
            </>
          )}
        </div>
      )}
      {modoVerificacion === "resetPassword" && (
        <div>
          <form
            onSubmit={actualizarContrasena}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              required
              name="contrasena"
              placeholder="Contraseña"
              value={formContrasena}
              onChange={cambiarDatos}
            />
            <p>Escribe tu correo</p>
            <br />

            <input type="submit" value="Actualizar" className="boton-mediano" />
            <br />

            <p>
              Ya me recorde la contraseña
              <Link to="/ingresar"> Ingresar</Link>
            </p>
          </form>
          <div>
            {confirmarContrasena === "esperando" && <h3>Procesando....</h3>}
            {confirmarContrasena === "error" && (
              <h3>Error en el cambio de contraseña</h3>
            )}
            {confirmarContrasena === "no" && (
              <h3>No se puede cambiar la contraseña</h3>
            )}
            {confirmarContrasena === "cambiado" && (
              <>
                <h3>Se puedo cambiar su contraseña inicie sesión</h3>
                <Link to="/ingresar">Iniciar sesión</Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Verificar;
