import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@pages/Layout";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import NoPage from "@pages/NoPage";
import routes from "./data/routes.json"
import * as Pages from './pages/'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route key="h0" path="/" element={<Layout />}>
          {/* <Route index element={<Home />} />
          <Route path="crud" element={<Crud />} /> */}
          {routes.map(({ path, component }, index) => {
            const Page = component in Pages ? Pages[component as keyof typeof Pages] : NoPage;
            return <Route key={index} path={path} element={<Page />} />
          })}
          <Route key={999999999} path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
