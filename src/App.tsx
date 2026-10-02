import { RouterProvider, createBrowserRouter } from "react-router";

import Home from "./pages/Home/Home";
import Movies from "./pages/Movies/Movies";
import Error from "./pages/Error/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/movies",
    element: <Movies/>,
  },
  {
    path: "*",
    element: <Error>404!</Error>
  }
]);

function App() {
  return <RouterProvider router={router}/>
}

export default <App/>