import { createBrowserRouter } from "react-router-dom";
import Login from "../Pages/Login/Login";
import Home from "../Pages/Home/Home";
import InPlay from "../Pages/InPlay/InPlay";
import MultiMarkets from "../Pages/MultiMarket/MultiMarkets";
import Cricket from "../Pages/Cricket/Cricket";
import Soccer from "../Pages/Soccer/Soccer";
import Tennis from "../Pages/Tennis/Tennis";
import Sports from "../Pages/Sports/Sports";
import WommenLeague from "../Pages/WomenLeague/WomenLeague";
import MyAccount from "../Pages/My Acoount/My Account";
import MyAccountPhoneDevice from "../Pages/MyAccountPhoneDevice/MyAccountPhoneDevice";
import Result from "../Pages/Resukt/Result";
import BalanceTransfer from "../Pages/BalanceTransfer/BalanceTransfer";
import MainLayout from "../Layout/MainLayout";
import DashboardLayout from "../Layout/DashboardLayout";
import AdminDashboard from "../Pages/Dashboard/AdminDashboard";
import Setting from "../Pages/Dashboard/Setting";
import AdminSetting from "../Pages/Dashboard/AdminSetting";
import UsersData from "../Pages/Dashboard/UsersData";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";
import DemoGame from "../Pages/DemoGame/DemoGame";
import Banking from "../Pages/Dashboard/Banking/Banking";
import HomeControl from "../Pages/Dashboard/HomeControl";
import BetList from "../Pages/Dashboard/BetList";
import BetListLive from "../Pages/Dashboard/BetListLive";
import ActiveGame from "../Pages/Dashboard/ActiveGame";
import DeactiveGame from "../Pages/Dashboard/DeactiveGame";
import LiveGame from "../Pages/Dashboard/LiveGame";
import AccountSummary from "../Components/Dashboard/AccountSummary";
import AccountTabs from "../Components/Dashboard/AccountTabs";
import AccountStatementTabs from "../Components/Dashboard/AccountStatementTabs";
import Profile from "../Components/Dashboard/Profile";
import AddGame from "../Pages/Dashboard/AddGame";
import DashboardDeposits from "../Pages/Dashboard/DashboardDeposits";
import DashboardWithdraw from "../Pages/Dashboard/DashboardWithdraw";
import ColorControl from "../Pages/Dashboard/ColorControl";
import DepositMethod from "../Pages/Dashboard/DepositMethod";
import MotherAdminRoute from "./MotherAdminRoute";
import GameApi from "../Components/Dashboard/GameApi/GameApi";
import NotFound from "../Pages/NotFound";
import LoginForm from "../Pages/LoginForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/games/demo/:id",
        element: <DemoGame />,
      },
      {
        path: "/inplay",
        element: <InPlay />,
      },
      {
        path: "/multimarket",
        element: <MultiMarkets />,
      },
      { path: "/cricket", element: <Cricket /> },
      { path: "/soccer", element: <Soccer /> },
      { path: "/tennis", element: <Tennis /> },
      {
        path: "/sports",
        element: <Sports />,
      },
      { path: "/womenleague", element: <WommenLeague /> },
      {
        path: "/myaccount",
        element: (
          <PrivateRoute>
            <MyAccount />
          </PrivateRoute>
        ),
      },
      {
        path: "/myaccountphone",
        element: (
          <PrivateRoute>
            <MyAccountPhoneDevice />{" "}
          </PrivateRoute>
        ),
      },
      { path: "/result", element: <Result /> },
      { path: "/balancetransfer", element: <BalanceTransfer /> },
    ],
  },
  {
    path: "/admindashboard",
    element: (
      <AdminRoute>
        {" "}
        <DashboardLayout />
      </AdminRoute>
    ),
    children: [
      { path: "", element: <AdminDashboard /> },
      {
        path: "generalsetting",
        element: (
          <MotherAdminRoute>
            <Setting />
          </MotherAdminRoute>
        ),
      },
      {
        path: "adminsetting",
        element: (
          <MotherAdminRoute>
            <AdminSetting />
          </MotherAdminRoute>
        ),
      },
      {
        path: "gameapi",
        element: (
          <MotherAdminRoute>
            <GameApi />
          </MotherAdminRoute>
        ),
      },
      {
        path: "homecontrol",
        element: (
          <MotherAdminRoute>
            <HomeControl />
          </MotherAdminRoute>
        ),
      },
      {
        path: "colorcontrol",
        element: (
          <MotherAdminRoute>
            <ColorControl />
          </MotherAdminRoute>
        ),
      },
      {
        path: "addgame",
        element: (
          <MotherAdminRoute>
            <AddGame />
          </MotherAdminRoute>
        ),
      },
      { path: "myaccount", element: <MyAccount /> },
      { path: "betlist", element: <BetList /> },
      { path: "betlive", element: <BetListLive /> },
      { path: "banking", element: <Banking /> },
      { path: "activegame", element: <ActiveGame /> },
      { path: "deactivegame", element: <DeactiveGame /> },
      {
        path: "livegame",
        element: (
          <MotherAdminRoute>
            <LiveGame />
          </MotherAdminRoute>
        ),
      },
      { path: "usersdata/:role", element: <UsersData /> },
      { path: "deposits", element: <DashboardDeposits /> },
      {
        path: "withdraws",
        element: (
          <MotherAdminRoute>
            <DashboardWithdraw />
          </MotherAdminRoute>
        ),
      },
      {
        path: "depositmethod",
        element: (
          <MotherAdminRoute>
            <DepositMethod />
          </MotherAdminRoute>
        ),
      },
    ],
  },
  {
    path: "/motheradmin",
    element: <LoginForm role="mother-admin" title="Mother Admin" />,
  },
  { path: "/admin", element: <LoginForm role="admin" title="Admin" /> },
  {
    path: "/subadmin",
    element: <LoginForm role="sub-admin" title="Sub Admin" />,
  },
  { path: "/master", element: <LoginForm role="master" title="Master" /> },
  { path: "/agent", element: <LoginForm role="agent" title="Agent" /> },
  {
    path: "/subagent",
    element: <LoginForm role="sub-agent" title="Sub Agent" />,
  },
  { path: "/accountsummary", element: <AccountSummary /> },
  { path: "/accounttabs", element: <AccountTabs /> },
  { path: "/accountstatementtabs", element: <AccountStatementTabs /> },
  { path: "/profile", element: <Profile /> },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
