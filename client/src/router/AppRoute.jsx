import Conference from "../pages/Conference";
import CreateRoom from "../pages/CreateRoom";
import {Login} from "@/components/authentication/Login.jsx";
import Home from "@/pages/Home";

import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Layout from "@/components/Layout.jsx";


const Router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        children: [
            {
                index: true,
                element: <Home/>,
            }, {
                path: "/create-room",
                element: <CreateRoom/>,
            },
        ]
    },
    {
        path: "/meeting/:roomId",
        element: <Conference/>,
    },

    {
        path: "/login",
        element: <Login/>,
    },
]);

const AppRouter = () => {
    return (
        <RouterProvider router={Router}/>
    );
};

export default AppRouter;
