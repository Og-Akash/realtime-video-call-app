import React from "react";
import {Outlet} from "react-router-dom";
import {Navbar} from "@/components/Navbar/Navbar.jsx"; // Import your Navbar component

const Layout = () => {
    return (
        <>
            <Navbar/> {/* This will appear on all pages except login */}
            <main>
                <Outlet/> {/* This renders the child routes */}
            </main>
        </>
    );
};

export default Layout;
