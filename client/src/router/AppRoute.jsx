import { lazy, Suspense } from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@/components/Layout.jsx";
import Loader from "../components/Loader";
const Conference = lazy(() => import("../pages/Conference"));
const Rooms = lazy(() => import("../pages/Rooms"));
const Login = lazy(() => import("@/components/authentication/Login.jsx"));
const Home = lazy(() => import("@/pages/Home"));

const Router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader>Loading...</Loader>}>
        <Layout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/rooms",
        element: <Rooms />,
      },
    ],
  },
  {
    path: "/meeting/:roomId",
    element: <Conference />,
  },

  {
    path: "/login",
    element: <Login />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={Router} />;
};

export default AppRouter;
