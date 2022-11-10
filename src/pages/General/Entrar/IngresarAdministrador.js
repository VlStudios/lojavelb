import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { EstadoContexto } from "../../../context/EstadoGeneral";
import {
  ingresarClienteAuthAdministrador,
  traerUnAdministrador,
} from "../../../controllers/Sesion";

/* ESTADO INICIAL FORMULARIO INGRESAR */
const initFormIngresar = {
  correo: "",
  contrasena: "",
};

const IngresarAdministrador = (props) => {
  const { iniciarSesion } = useContext(EstadoContexto);
  const [formIngresar, setFormIngresar] = useState(initFormIngresar);
  const [usuarioVerificado, setUsuarioVerificado] = useState();

  const cambiarDatos = (e) => {
    const { name, value } = e.target;
    setFormIngresar({
      ...formIngresar,
      [name]: value,
    });
  };

  useEffect(() => {
    if (usuarioVerificado) {
      (async () => {
        const usuarioDB = await traerUnAdministrador(usuarioVerificado);
        iniciarSesion(usuarioDB);
        props.history.push("/administrador/reportes");
      })();
    }
  }, [usuarioVerificado, iniciarSesion, props.history]);

  const ingresar = (e) => {
    e.preventDefault();
    ingresarClienteAuthAdministrador(formIngresar).then((res) => {
      if (res.idUsuario) {
        setUsuarioVerificado(res);
      } else if (res === "contrasenaIncorrecta") {
        console.log("Contraseña Incorrecta");
      } else {
        console.log("Hay un error");
      }
    });
  };

  return (
    <>
      <div className="grid-registro">
        <div className="grid-registro-imagen">
          <img src="/images/sesion/imagenIngresoLogan.jpg" alt={"hola"} />
          <div className="contenedor-registro-imagen">
            <h2>Las mejores mochilas lo tiene LOGAN</h2>
            <h3>Angie, Hugo y Paloma</h3>
            <p>Esto Es Guerra</p>
          </div>
        </div>
        <div className="grid-registro-formulario">
          <h2>Ingresar</h2>
          <form onSubmit={ingresar}>
            <input
              type="text"
              required
              name="correo"
              placeholder="Correo"
              value={formIngresar.correo}
              onChange={cambiarDatos}
            />
            <input
              type="password"
              required
              name="contrasena"
              placeholder="Contraseña"
              value={formIngresar.contrasena}
              onChange={cambiarDatos}
            />
            <input type="submit" value="Ingresar" />
            <p>
              Quiero
              <Link to="/recuperar-contrasena"> Recuperar </Link>
              mi cuenta. Olvidé mi contraseña.
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default IngresarAdministrador;
