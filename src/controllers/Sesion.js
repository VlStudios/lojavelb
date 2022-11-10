import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  checkActionCode,
  applyActionCode,
  signInWithEmailAndPassword,
  verifyPasswordResetCode,
  confirmPasswordReset,
  sendPasswordResetEmail,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../db/firebase";
const auth = getAuth();
const coleccion = "Clientes";
const coleccionAdminstrador = "Personales";

export const registrarCliente = async (formRegistrar, userId) => {
  try {
    console.log(formRegistrar, userId)
    await setDoc(doc(db, coleccion, userId), {
      Nombres: formRegistrar.nombres,
      Apellidos: formRegistrar.apellidos,
      Correo: formRegistrar.correo,
      Metodo: "correo",
      Confirmacion: false,
      Rol: "cliente"
    });
  } catch (e) {
    console.error("Error al registrar personal ", e);
  }
};

export const registrarClienteAuth = (formRegistrar) => {
  return createUserWithEmailAndPassword(
    auth,
    formRegistrar.correo,
    formRegistrar.contrasena
  )
    .then((userCredential) => {
      const userId = userCredential.user.uid;
      return sendEmailVerification(userCredential.user).then(() => {
        registrarCliente(formRegistrar, userId);
        return "Correcto";
      });
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        return "Repetido";
      } else if (error.code === "auth/weak-password") {
        return "Contrasena";
      }
    });
};
export const verificarCuentaCorreo = (actionCode) => {
  var restoredEmail = null;
  return checkActionCode(auth, actionCode)
    .then((info) => {
      restoredEmail = info["data"]["email"];
      applyActionCode(auth, actionCode);
      return restoredEmail;
    })
    .catch((error) => {
      if (error.code === "auth/invalid-action-code") {
        return "expirado";
      } else {
        return "error";
      }
    });
};

export const ingresarClienteAuth = (formIngresar) => {
  return signInWithEmailAndPassword(
    auth,
    formIngresar.correo,
    formIngresar.contrasena
  )
    .then((userCredential) => {
      console.log(userCredential)
      //const correoVerificado = userCredential.user.emailVerified;
      const usuario = {
        idUsuario: userCredential.user.uid,
        token: userCredential.user.accessToken,
      };
      //if (correoVerificado) {
        return usuario;
      //} else {
      //  return "noVerificado";
      //}
    })
    .catch((error) => {
      if (error.code === "auth/wrong-password") {
        return "contrasenaIncorrecta";
      } else {
        return "error";
      }
    });
};

export const clienteEditarToken = async (idUsuario, token) => {
  const clienteRef = doc(db, coleccion, idUsuario);
  await updateDoc(clienteRef, { IdToken: token });
};

export const traerUnCliente = async (usuarioVerificado) => {
  const idUsuario = usuarioVerificado.idUsuario;
  const token = usuarioVerificado.token;
  const idTokenLS = localStorage.getItem("IdToken");

  const clienteRef = doc(db, coleccion, idUsuario);
  const docCliente = await getDoc(clienteRef);
  if (docCliente.exists()) {
    if (idTokenLS && idTokenLS === docCliente.data().IdToken) {
      return {
        IdCliente: idUsuario,
        ...docCliente.data(),
      };
    } else {
      clienteEditarToken(idUsuario, token);
      return {
        Metodo: docCliente.data().Metodo,
        IdCliente: idUsuario,
        IdToken: token,
        Correo: docCliente.data().Correo,
        Nombres: docCliente.data().Nombres,
        Apellidos: docCliente.data().Apellidos,
        Genero: docCliente.data().Genero,
        FechaNacimiento: docCliente.data().FechaNacimiento,
        Celular: docCliente.data().Celular,
        FotoUrl: docCliente.data().FotoUrl,
        Confirmacion: docCliente.data().Confirmacion,
        Rol: docCliente.data().Rol,
      };
    }
  } else {
    console.log("No existe el documento");
  }
};

export const recuperarContrasena = (formCorreo) => {
  return sendPasswordResetEmail(auth, formCorreo)
    .then(() => {
      return "correcto";
    })
    .catch(() => {
      return "error";
    });
};

export const actualizarCuentaContrasena = (actionCode, formContrasena) => {
  return verifyPasswordResetCode(auth, actionCode)
    .then(() => {
      console.log(actionCode)
      console.log(formContrasena)
      return confirmPasswordReset(auth, actionCode, formContrasena)
        .then(() => {
          return "cambiado";
        })
        .catch(() => {
          return "no";
        });
    })
    .catch(() => {
      return "error";
    });
};

export const ingresarConFacebook = () => {
  const providerFacebook = new FacebookAuthProvider();

  return signInWithPopup(auth, providerFacebook)
    .then((result) => {
      const userId = result.user.uid;

      const credential = FacebookAuthProvider.credentialFromResult(result);

      const accessToken = credential.accessToken;

      const formRegistrar = {
        nombres: result.user.displayName,
        apellidos: result.user.email.split("@")[0],
        correo: result.user.email,
        metodo: "facebook",
        confirmacion: true,
        idToken: accessToken,
      };
      if (accessToken) {
        const usuario = {
          idUsuario: userId,
          token: accessToken,
        };
        registrarCliente(formRegistrar, userId);
        return usuario;
      } else {
        return "noAccess";
      }
    })
    .catch((error) => {
      const credential = FacebookAuthProvider.credentialFromError(error);
      console.log(credential);
      if (error.code === "auth/account-exists-with-different-credential") {
        return "existe";
      } else {
        return "error";
      }
    });
};

export const editarTokenAdministrador = async (idUsuario, token) => {
  const clienteRef = doc(db, coleccionAdminstrador, idUsuario);
  await updateDoc(clienteRef, { IdToken: token });
};


export const ingresarClienteAuthAdministrador = (formIngresar) => {
  return signInWithEmailAndPassword(
    auth,
    formIngresar.correo,
    formIngresar.contrasena
  )
    .then((userCredential) => {
      const usuario = {
        idUsuario: userCredential.user.uid,
        token: userCredential.user.accessToken,
      };
      return usuario;
    })
    .catch((error) => {
      if (error.code === "auth/wrong-password") {
        return "contrasenaIncorrecta";
      } else {
        return "error";
      }
    });
};

export const traerUnAdministrador = async (usuarioVerificado) => {
  const idUsuario = usuarioVerificado.idUsuario;
  const token = usuarioVerificado.token;
  const idTokenLS = localStorage.getItem("IdToken");

  const personalRef = doc(db, coleccionAdminstrador, idUsuario);
  const docPersonal = await getDoc(personalRef);
  if (docPersonal.exists()) {
    if (idTokenLS && idTokenLS === docPersonal.data().IdToken) {
      return {
        IdCliente: idUsuario,
        ...docPersonal.data(),
      };
    } else {
      editarTokenAdministrador(idUsuario, token);
      return {
        IdCliente: idUsuario,
        IdToken: token,
        Correo: docPersonal.data().Correo,
        Nombres: docPersonal.data().Nombres,
        Celular: docPersonal.data().Celular,
        Rol: docPersonal.data().Rol,
      };
    }
  } else {
    console.log("No existe el documento");
  }
};

export const registrarPersonal = async (formPersonal, userId, categoriaSelect) => {
  try {
    await setDoc(doc(db, coleccionAdminstrador, userId), {
      Nombres: formPersonal.nombres,
      Celular: formPersonal.celular,
      Correo: formPersonal.correo,
      Rol: categoriaSelect
    });
  } catch (e) {
    console.error("Error al registrar personal ", e);
  }
};

export const registrarPersonalAuth = (formPersonal, categoriaSelect ) => {
  return createUserWithEmailAndPassword(
    auth,
    formPersonal.correo,
    formPersonal.contrasena
  )
    .then((userCredential) => {
      const userId = userCredential.user.uid;
      return sendEmailVerification(userCredential.user).then(() => {
        registrarPersonal(formPersonal, userId, categoriaSelect);
        return "Correcto";
      });
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        return "Repetido";
      } else if (error.code === "auth/weak-password") {
        return "Contrasena";
      }
    });
};