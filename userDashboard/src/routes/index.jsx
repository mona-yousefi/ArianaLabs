import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
  },
  {
    path:"sign-up",
    element:<SignUp/>
  },
  {
    path:"dashboard",
    element:<Dashboard/>
  }
])