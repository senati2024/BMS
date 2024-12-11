/*!

=========================================================
* Black Dashboard React v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import Prezurisacion from "views/Prezurisacion.js";
import Map from "views/Map.js";
import Notifications from "views/Notifications.js";
import TableList from "views/TableList.js";
import Typography from "views/Typography.js";
import UserProfile from "views/UserProfile.js";
import Reporte from "views/Reporte.js";
var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/Prezurisacion",
    name: "Prezurisacion",
    icon: "tim-icons icon-atom",
    component: <Prezurisacion />,
    layout: "/admin",
  },
  {
    path: "/map",
    name: "Map",
    icon: "tim-icons icon-pin",
    component: <Map />,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "Notificaciones",

    icon: "tim-icons icon-bell-55",
    component: <Notifications />,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "User Profile",

    icon: "tim-icons icon-single-02",
    component: <UserProfile />,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Table List",

    icon: "tim-icons icon-puzzle-10",
    component: <TableList />,
    layout: "/admin",
  },
  {
    path: "/typography",
    name: "Typography",

    icon: "tim-icons icon-align-center",
    component: <Typography />,
    layout: "/admin",
  },
  {
    path: "/reporte",
    name: "Reporte",

    icon: "tim-icons icon-align-center",
    component: <Reporte />,
    layout: "/admin",
  },
];
export default routes;
