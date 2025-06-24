import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthGuard } from "./guards";
import { PrivatesRoutes, PublicRoutes } from "./models";
import { Login } from "./pages/Login";
import { Private } from "./pages/Private";
import store from "./redux/store";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to={PrivatesRoutes.PRIVATE} />} />
            <Route path="*" element={<>NOT FOUND</>} />
            <Route path={PublicRoutes.LOGIN} element={<Login />} />
            <Route element={<AuthGuard />}>
              <Route path={`${PrivatesRoutes.PRIVATE}/*`} element={<Private />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
