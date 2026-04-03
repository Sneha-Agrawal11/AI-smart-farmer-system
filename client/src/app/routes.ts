import { createBrowserRouter } from "react-router";
import  HomeNew  from "./components/home/HomeNew";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { FarmerInput } from "./components/FarmerInput";
import { ResultsDashboard } from "./components/ResultsDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomeNew,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/input",
    Component: FarmerInput,
  },
  {
    path: "/results",
    Component: ResultsDashboard,
  },
]);
