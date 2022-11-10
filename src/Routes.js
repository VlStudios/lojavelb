import React from "react";
import { Switch, Redirect } from "react-router-dom";
import {
  RutaPublica,
} from "./router";
import {
  LayoutGeneral,
} from "./layout/conLayout";
import SinLayout from "./layout/sinLayout/SinLayout";

import {
  Pagina404,
  GeneralInicio,

} from "./pages";

const Routes = () => {
  return (
    <Switch>
      {/* RUTAS PUBLICAS*/}
      <RutaPublica
        component={GeneralInicio}
        exact
        layout={LayoutGeneral}
        path="/"
      />
      
      {/* RUTAS NO ENCONTRADAS*/}
      <RutaPublica
        component={Pagina404}
        exact
        layout={SinLayout}
        path="/pagina-no-encontrada"
      />
      <Redirect to="/pagina-no-encontrada" />
    </Switch>
  );
};

export default Routes;
