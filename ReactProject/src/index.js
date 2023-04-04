import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Shortener from "./Shortener/Shortener";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Error from "./error/Error";

const AppLayout = () => {
  return (
    <>
      <Shortener />
    </>
  );
};
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />);
