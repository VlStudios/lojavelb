import React, { useReducer, createContext, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../db/firebase";
import { onSnapshot, doc } from "firebase/firestore";

const estadoInicial = {
  usuario: {},
  productos: [],
  sidebar: false,
};

if (localStorage.getItem("IdToken")) {
  const usuarioData = {
    Metodo: localStorage.getItem("Metodo"),
    IdCliente: localStorage.getItem("IdCliente"),
    IdToken: localStorage.getItem("IdToken"),
    Correo: localStorage.getItem("Correo"),
    Nombres: localStorage.getItem("Nombres"),
    Apellidos: localStorage.getItem("Apellidos"),
    Genero: localStorage.getItem("Genero"),
    FechaNacimiento: localStorage.getItem("FechaNacimiento"),
    Celular: localStorage.getItem("Celular"),
    FotoUrl: localStorage.getItem("FotoUrl"),
    Rol: localStorage.getItem("Rol"),
  };
  estadoInicial.usuario = usuarioData;
} else {
  estadoInicial.usuario = {};
}

const EstadoContexto = createContext({
  usuario: {},
  cerrarSesion: () => {},
  iniciarSesion: (usuarioData) => {},
  productos: [],
  sidebar: false,
  cambiarEstadoSidebar: (estado) => {},
  agregarProducto: (producto) => {},
  eliminarProducto: (id) => {},
  aumentarCantidad: () => {},
  disminuirCantidad: () => {},
  eliminarCarrito: () => {},
  totalAPagar: () => {},
});

function estadoReductor(state, action) {
  switch (action.type) {
    case "NUEVA_SESION":
      return {
        ...state,
        usuario: Object.assign(state.usuario, action.payload),
      };
    case "CERRAR_SESION":
      return { ...state, usuario: {} };
    case "CAMBIAR_ESTADO_SIDEBAR":
      return { ...state, sidebar: action.sidebar };
    case "AGREGAR_PRODUCTO":
      return { ...state, productos: [...state.productos, action.payload] };
    case "AUMENTAR_CANTIDAD":
      return {
        ...state,
        productos: state.productos.filter((pro) =>
          pro.IdProducto === action.payload.id
            ? (pro.Unidades = action.payload.uni + 1)
            : pro.Unidades
        ),
      };
    case "DISMINUIR_CANTIDAD":
      return {
        ...state,
        productos: state.productos.filter((pro) =>
          pro.IdProducto === action.payload.id
            ? (pro.Unidades = action.payload.uni - 1)
            : pro.Unidades
        ),
      };
    case "ELIMINAR_PRODUCTO":
      const index = state.productos.findIndex(
        (producto) => producto.IdProducto === action.id
      );
      let nuevoCarrito = [...state.productos];
      if (index >= 0) {
        nuevoCarrito.splice(index, 1);
      } else {
        console.log(`Cant remove product (id: ${action.id})!`);
      }
      return {
        ...state,
        productos: nuevoCarrito,
      };
    case "ELIMINAR_CARRITO":
      return { ...state, productos: action.productos };

    default:
      return state;
  }
}

function EstadoProveedor(props) {
  const [state, dispatch] = useReducer(estadoReductor, estadoInicial);

  useEffect(() => {
    if (localStorage.getItem("IdToken")) {
      const rolUsuario = localStorage.getItem("Rol");
      const clienteRef = doc(
        db,
        `${rolUsuario === "administrador" ? "Personales" : "Clientes"}`,
        localStorage.getItem("IdCliente")
      );
      onSnapshot(clienteRef, (doc) => {
        if (localStorage.getItem("IdToken") === doc.data().IdToken) {
          const userData = {
            Nombres: doc.data().Nombres,
            Apellidos: doc.data().Apellidos,
            Genero: doc.data().Genero,
            FechaNacimiento: doc.data().FechaNacimiento,
            Celular: doc.data().Celular,
            FotoUrl: doc.data().FotoUrl,
          };
          dispatch({
            type: "NUEVA_SESION",
            payload: userData,
          });
          localStorage.setItem("Nombres", doc.data().Nombres);
          localStorage.setItem("Apellidos", doc.data().Apellidos);
          localStorage.setItem("Genero", doc.data().Genero);
          localStorage.setItem("FechaNacimiento", doc.data().FechaNacimiento);
          localStorage.setItem("Celular", doc.data().Celular);
          localStorage.setItem("FotoUrl", doc.data().FotoUrl);
        } else {
          console.log("NO HAY USUARIO");
          cerrarSesion();
        }
      });
    }
  }, [state.user]);

  function iniciarSesion(usuarioData) {
    localStorage.setItem("Metodo", usuarioData.Metodo);
    localStorage.setItem("IdCliente", usuarioData.IdCliente);
    localStorage.setItem("IdToken", usuarioData.IdToken);
    localStorage.setItem("Correo", usuarioData.Correo);
    localStorage.setItem("Nombres", usuarioData.Nombres);
    localStorage.setItem("Apellidos", usuarioData.Apellidos);
    localStorage.setItem("Genero", usuarioData.Genero);
    localStorage.setItem("FechaNacimiento", usuarioData.FechaNacimiento);
    localStorage.setItem("Celular", usuarioData.Celular);
    localStorage.setItem("FotoUrl", usuarioData.FotoUrl);
    localStorage.setItem("Rol", usuarioData.Rol);

    dispatch({
      type: "NUEVA_SESION",
      payload: usuarioData,
    });
  }

  function cerrarSesion() {
    localStorage.removeItem("Metodo");
    localStorage.removeItem("IdCliente");
    localStorage.removeItem("IdToken");
    localStorage.removeItem("Correo");
    localStorage.removeItem("Nombres");
    localStorage.removeItem("Apellidos");
    localStorage.removeItem("Genero");
    localStorage.removeItem("FechaNacimiento");
    localStorage.removeItem("Celular");
    localStorage.removeItem("FotoUrl");
    localStorage.removeItem("Rol");
    signOut(auth)
      .then(() => {
        dispatch({
          type: "CERRAR_SESION",
          user: {},
        });
      })
      .catch((error) => {
        console.log("Error cerrar sesión: ", error);
      });
  }

  const cambiarEstadoSidebar = (estado) => {
    dispatch({ type: "CAMBIAR_ESTADO_SIDEBAR", sidebar: estado });
  };

  const agregarProducto = (producto) => {
    dispatch({
      type: "AGREGAR_PRODUCTO",
      payload: {
        Unidades: 1,
        ...producto,
      },
    });
  };

  const aumentarCantidad = (IdProducto, Unidades) => {
    dispatch({
      type: "AUMENTAR_CANTIDAD",
      payload: {
        id: IdProducto,
        uni: Unidades,
      },
    });
  };

  const disminuirCantidad = (IdProducto, Unidades) => {
    dispatch({
      type: "DISMINUIR_CANTIDAD",
      payload: {
        id: IdProducto,
        uni: Unidades,
      },
    });
  };

  const eliminarProducto = (IdProducto) => {
    dispatch({
      type: "ELIMINAR_PRODUCTO",
      id: IdProducto,
    });
  };
  const eliminarCarrito = () => {
    dispatch({ type: "ELIMINAR_CARRITO", productos: [] });
  };

  const totalAPagar = () =>
    state.productos?.reduce(
      (antes, actual) => parseFloat(actual.Precio) * actual.Unidades + antes,
      0
    );

  return (
    <EstadoContexto.Provider
      value={{
        usuario: state.usuario,
        cerrarSesion,
        iniciarSesion,
        productos: state.productos,
        sidebar: state.sidebar,
        cambiarEstadoSidebar,
        agregarProducto,
        eliminarProducto,
        aumentarCantidad,
        disminuirCantidad,
        eliminarCarrito,
        totalAPagar,
      }}
      {...props}
    />
  );
}

export { EstadoContexto, EstadoProveedor };
