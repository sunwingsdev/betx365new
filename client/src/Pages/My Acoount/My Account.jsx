import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import MyProfile from "../../Components/MyAccount/MyProfile";
import BalanceOverview from "../../Components/MyAccount/BalanceOverview";
import AccountStatement from "../../Components/MyAccount/AccountStatement";
import MyBets from "../../Components/MyAccount/MyBets";
import Activity from "../../Components/MyAccount/Activity";
import Deposit from "../../Components/MyAccount/Deposit";
import Withdraw from "../../Components/MyAccount/Withdraw";
import PtoPTransfer from "../../Components/MyAccount/PtoPTransfer";
import DepositHistory from "../../Components/MyAccount/DepositHistory";
import WithdrawHistory from "../../Components/MyAccount/WithdrawHistory";
import { useSelector } from "react-redux";

const MyAccount = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(1);
  const location = useLocation();

  // Define all tabs
  const allTabs = [
    { id: 1, label: "My Profile" },
    { id: 2, label: "Deposit", condition: user?.createdBy === "self" },
    { id: 3, label: "Deposit History", condition: user?.createdBy === "self" },
    { id: 4, label: "Withdraw", condition: user?.createdBy === "self" },
    { id: 5, label: "Withdraw History", condition: user?.createdBy === "self" },
    { id: 6, label: "Balance OverView" },
    { id: 7, label: "P2P Transfer" },
    { id: 8, label: "Account Statement" },
    { id: 9, label: "My Bets" },
    { id: 10, label: "Activity Log" },
  ];

  // Filter tabs based on user condition
  const filteredTabs = allTabs.filter((tab) => tab.condition === undefined || tab.condition);

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) {
      setActiveTab(Number(hash));
    }
  }, [location]);

  return (
    <div className="bg-inPlayBgColor px-4">
      {/* Tabs on top for mobile */}
      <div className="md:hidden flex overflow-x-auto bg-customWhite shadow-lg">
        {filteredTabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 px-4 py-2 text-sm whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-500"
                : "border-transparent"
            }`}
            onClick={() => {
              setActiveTab(tab.id);
              window.location.hash = tab.id;
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sidebar for larger screens */}
      <div className="md:flex flex-row gap-x-4">
        <div className="w-[30%] hidden md:block h-min bg-customWhite shadow-lg">
          <div className="flex flex-row justify-between bg-logoutBlueColor p-2">
            <BsThreeDotsVertical className="text-white w-6 h-6" />
            <h2 className="px-4 text-sm font-bold text-customWhite">
              My Account
            </h2>
          </div>
          {filteredTabs.map((tab) => (
            <div
              key={tab.id}
              className="text-sm border-b border-sliderButtonMediumGray"
            >
              <button
                className={`block w-full px-2 py-1 text-left text-sm hover:text-customWhite hover:bg-sliderButtonMediumGray ${
                  activeTab === tab.id
                    ? "bg-sliderButtonMediumGray text-customWhite"
                    : ""
                }`}
                onClick={() => {
                  setActiveTab(tab.id);
                  window.location.hash = tab.id;
                }}
              >
                {tab.label}
              </button>
            </div>
          ))}
        </div>
        {/* Tab content */}
        <div className="w-full md:w-[70%] bg-inPlayBgColor">
          {activeTab === 1 && <MyProfile />}
          {activeTab === 2 && user?.createdBy === "self" && <Deposit />}
          {activeTab === 3 && user?.createdBy === "self" && <DepositHistory />}
          {activeTab === 4 && user?.createdBy === "self" && <Withdraw />}
          {activeTab === 5 && user?.createdBy === "self" && <WithdrawHistory />}
          {activeTab === 6 && <BalanceOverview />}
          {activeTab === 7 && <PtoPTransfer />}
          {activeTab === 8 && <AccountStatement />}
          {activeTab === 9 && <MyBets />}
          {activeTab === 10 && <Activity />}
        </div>
      </div>
    </div>
  );
};

export default MyAccount;