import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import "src/global.css";

import Layout from "src/layout/Layout";

import Home from "./pages/Home/Home";
import Movies from "./pages/Movies/Movies";
import NotFound from "./pages/Error/Error";

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/movies", element: <Movies /> },
            { path: "*", element: <NotFound>404!</NotFound> },
        ],
    },
]);

export default function App() {
    return <RouterProvider router={router} />;
}