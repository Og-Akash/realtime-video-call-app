import Conference from "../pages/Conference";
import CreateRoom from "../pages/CreateRoom";
import Home from "@/pages/Home";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/create-room",
    element: <CreateRoom />,
  },
  {
    path: "/meeting/:id",
    element: <Conference />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={Router} />;
};
export default AppRouter;
