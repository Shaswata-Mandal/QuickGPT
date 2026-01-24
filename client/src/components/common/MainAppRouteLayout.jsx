import { Outlet } from "react-router-dom";
import MainAppLayout from "./MainAppLayout";

const MainAppRouteLayout = () => {
  return <MainAppLayout content={<Outlet />} />;
};

export default MainAppRouteLayout;
