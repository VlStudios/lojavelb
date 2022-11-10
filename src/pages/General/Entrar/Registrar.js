import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { registrarClienteAuth } from "../../../controllers/Sesion";
import { pedidoUnoIgual } from "../../../controllers/Pedidos";
import "./Registrar.css";

const initFormRegistrar = {
  nombres: "",
  apellidos: "",
  correo: "",
  contrasena: "",
};

const Registrar = (props) => {
  const [formRegistrar, setFormRegistrar] = useState(initFormRegistrar);
  const cambiarDatos = (e) => {
    const { name, value } = e.target;
    setFormRegistrar({
      ...formRegistrar,
      [name]: value,
    });
  };

useEffect(() => {
    (async () => {
      const pedido = "001638196841543"
      const productosDB = await pedidoUnoIgual(pedido);
      console.log(productosDB);
    })();
  }, []);

  const registrar = (e) => {
    e.preventDefault();
    registrarClienteAuth(formRegistrar).then((res) => {
      if (res === "Correcto") {
        console.log(
          "Registrado Correctamente, verifique su correo para validar."
        );
        props.history.push("/gracias-por-registrarte");
      } else if (res === "Repetido") {
        console.log("Este correo ya fue registrado");
        props.history.push("/ingresar");
      } else if (res === "Contrasena") {
        console.log("Contraseña debe ser mayor de 6 dígitos");
      }
    });
    setFormRegistrar(initFormRegistrar);
  };

  return (
    <>
      <div className="grid-registro">
        <div className="grid-registro-imagen">
          <img src="/images/sesion/imagenRegistroLogan.jpg" alt={"hola"} />

          <div className="contenedor-registro-imagen">
            <h2>Registrate y compra tu estilo.</h2>
            <h3>Nickol Sinchi </h3>
            <p>Corazón Serrano</p>
          </div>
        </div>
        <div className="grid-registro-formulario">
          <h2>Registrar</h2>
          <p>mi cuenta con Facebook</p>
          <button className="grid-registro-facebook">Facebook</button>

          <form onSubmit={registrar}>
            <input
              type="text"
              required
              name="nombres"
              placeholder="Nombres"
              value={formRegistrar.nombres}
              onChange={cambiarDatos}
            />

            <input
              type="text"
              required
              name="apellidos"
              placeholder="Apellidos"
              value={formRegistrar.apellidos}
              onChange={cambiarDatos}
            />
            <input
              type="text"
              required
              name="correo"
              placeholder="Correo"
              value={formRegistrar.correo}
              onChange={cambiarDatos}
            />
            <input
              type="password"
              required
              name="contrasena"
              placeholder="Contraseña"
              value={formRegistrar.contrasena}
              onChange={cambiarDatos}
            />
            <p>
              Al registrarse usted Autoriza recibir comunicaciones promocionales
              y el uso de su información para fines adicionales.
            </p>

            <p>
              También declara que leyó y aceptó la
              <Link to="/politica-de-privacidad"> Política de Privacidad</Link>y
              los
              <Link to="/terminos-y-condiciones"> Términos y Condiciones</Link>
              del Centro Comercial El Hueco.
            </p>
            <input type="submit" value="Registrar" />
            <p>
              Tengo una cuenta, quiero
              <Link to="/ingresar"> Ingresar</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Registrar;
