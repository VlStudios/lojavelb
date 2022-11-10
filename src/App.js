import './App.css';
import { EstadoProveedor } from "./context/EstadoGeneral";
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";
import Routes from "./Routes";
const browserHistory = createBrowserHistory();

function App() {
  return (
    <EstadoProveedor>
      <Router history={browserHistory}>
        <Routes />
      </Router>
    </EstadoProveedor>
  );
}

export default App;
