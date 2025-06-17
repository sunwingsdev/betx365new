import { useEffect, useRef, useState } from "react";
import { CiDollar } from "react-icons/ci";
import { IoReload } from "react-icons/io5";
import { HiOutlineArrowRightStartOnRectangle } from "react-icons/hi2";
import { IoSettingsSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useLazyGetAuthenticatedUserQuery,
  useLazyGetUserByIdQuery,
  useLoginUserMutation,
} from "../../redux/features/allApis/usersApi/usersApi";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  setCredentials,
  setSingleUser,
} from "../../redux/slices/authSlice";
import { useGetHomeControlsQuery } from "../../redux/features/allApis/homeControlApi/homeControlApi";
import RegistrationForm from "../forms/RegistrationForm";
import { IoIosLogIn } from "react-icons/io";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { useGetColorControlsQuery } from "../../redux/features/allApis/colorControlApi/colorControlApi";
import { FaUser } from "react-icons/fa";

const TopHeader = ({ settingOpen, setSettingOpen }) => {
  const { data: homeControls } = useGetHomeControlsQuery();
  const { data: colorControls } = useGetColorControlsQuery();
  const { user, token, singleUser } = useSelector((state) => state.auth);
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [getUser] = useLazyGetAuthenticatedUserQuery();
  const [getSingleUser] = useLazyGetUserByIdQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [validationCode, setValidationCode] = useState(generateRandomCode());
  const [enteredValidationCode, setEnteredValidationCode] = useState(""); // State for entered validation code
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const headingColorControl = colorControls?.find(
    (colorControl) => colorControl?.section === "home-header"
  );

  useEffect(() => {
    if (!user) return;
    getSingleUser(user?._id).then(({ data }) => {
      dispatch(setSingleUser(data));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const control = homeControls?.find(
    (control) => control.category === "logo" && control.isSelected
  );

  function generateRandomCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  // Function to reset the validation code
  const resetValidationCode = () => {
    setValidationCode(generateRandomCode());
    setEnteredValidationCode(""); // Clear the entered validation code on reset
  };

  const events = [
    "React Meetup",
    "JS Conference",
    "CSS Workshop",
    "Next.js Summit",
  ];
  const profileInformation = [
    { id: 1, name: "My Profile", path: "/myaccount#1" },
    {
      id: 2,
      name: "Deposit",
      path: "/myaccount#2",
      condition: user?.createdBy === "self",
    },
    {
      id: 3,
      name: "Withdraw",
      path: "/myaccount#4",
      condition: user?.createdBy === "self",
    },
    { id: 4, name: "Balance Overview", path: "/myaccount#6" },
    { id: 5, name: "Account Statement", path: "/myaccount#8" },
    { id: 6, name: "My Bets", path: "/myaccount#9" },
    { id: 7, name: "Bets History", path: "/myaccount#5-2" },
    { id: 8, name: "Profit Loss", path: "/myaccount#5-3" },
    { id: 9, name: "Activity Log", path: "/myaccount#10" },
    { id: 10, name: "Check Sport Wise Result", path: "/result" },
    { id: 11, name: "Balance Transfer", path: "/balancetransfer" },
  ];

  const filteredProfileInformation = profileInformation.filter(
    (item) => item.condition === undefined || item.condition
  );

  const [searchText, setSearchText] = useState("");
  const [myAccountOpen, setMyAccountOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e, setter) => {
    setter(e.target.value);
  };

  const reloadBalance = () => {
    if (!user) return;

    setLoading(true);

    getSingleUser(user?._id)
      .then(({ data }) => {
        dispatch(setSingleUser(data));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handelLogin = async () => {
    try {
      const { data: loginData } = await loginUser({ username, password });

      if (loginData.token) {
        const { data: userData } = await getUser(loginData.token);
        if (
          userData?.status === "banned" ||
          userData?.status === "deactivated" ||
          userData?.status === null ||
          userData?.status === undefined
        ) {
          toast.error("Your account is deactivated or banned");
          return;
        }
        if (userData?.role !== "user") {
          toast.error("You are not allowed to login");
          return;
        }
        dispatch(setCredentials({ token: loginData.token, user: userData }));
        toast.success("Login successful");
        resetValidationCode();
        navigate("/");
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Provide valid username and password");
      resetValidationCode();
    }
  };

  const accountRef = useRef(null);
  const modalRef = useRef(null);

  const handelChange = (e) => {
    setSearchText(e.target.value);
    console.log("Search Input:", e.target.value);
  };
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    toast.success("Logout successful");
    navigate("/");
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        accountRef.current &&
        !accountRef.current.contains(event.target) // My Account button e click hole ignore korbe
      ) {
        setMyAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const filteredEvents = events.filter((event) =>
    event.toLowerCase().includes(searchText.toLowerCase())
  );

  // Check if the entered validation code matches the generated code
  const isValidationCodeValid = enteredValidationCode === validationCode;

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to ${
          headingColorControl?.direction || "top"
        }, ${headingColorControl?.firstBackgroundColor || "#3a3a3a"}, ${
          headingColorControl?.secondBackgroundColor || "#000000"
        })`,
      }}
      className="px-1 py-1 md:py-3 md:px-2   md:flex flex-row gap-2 items-center justify-between"
    >
      <div className="flex flex-row items-center justify-between w-full lg:w-auto gap-2">
        {/* Logo */}

        <Link to="/" className="">
          <img
            src={`${import.meta.env.VITE_BASE_API_URL}${control?.image}`}
            alt=""
            className={`w-full max-w-[180px] ${user && "hidden lg:block"}`}
          />
        </Link>

        <div className="flex  gap-3">
          {/* Login Button */}
          {!user && (
            <div className="relative lg:hidden">
              <Link className="" to="/login">
                <button className="bg-loginRedColor flex items-center justify-center gap-2 text-customWhite px-3 py-1 h-min rounded-sm font-medium text-sm">
                  <FaUser className="text-base" /> Login
                </button>
              </Link>
            </div>
          )}
          {/* Sign Up Button */}
          {/* {!user && (
            <button
              // onClick={openRegisterModal}
              className="lg:hidden bg-yellow-500 text-black px-3 py-1 whitespace-nowrap h-min font-medium text-sm flex items-center justify-center gap-1"
            >
              Sign Up <FaArrowUpRightFromSquare />
            </button>
          )} */}
        </div>

        <div className="relative hidden lg:flex flex-col gap-2">
          {/* Search Input */}
          <div className="relative">
            <input
              type="search"
              value={searchText}
              onChange={handelChange}
              className="w-full h-min pl-6 pr-8 rounded-md placeholder:text-xs border border-gray-300"
              placeholder="Search Events"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-4 h-auto absolute top-1 left-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 3 10.5a7.5 7.5 0 0 0 13.65 6.15z"
              />
            </svg>
          </div>

          {/* No Events Found Message */}
          {searchText && filteredEvents.length === 0 && (
            <p className="text-xs absolute  left-0 w-full  shadow-lg    mt-6  bg-customWhite px-2 py-1 rounded-b-md text-customBlack z-50">
              No events found matching...
            </p>
          )}
        </div>
      </div>
      {/* login page design */}
      {!user && !token ? (
        <>
          <div className="hidden lg:flex flex-row gap-2 items-center">
            <div>
              <input
                type="text"
                name=""
                id=""
                placeholder="Username"
                className="h-min rounded-md pl-2 w-full placeholder:text-xs"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="relative  gap-2  ">
              <input
                type={showPassword ? "text" : "password"}
                name=""
                id=""
                placeholder="Password"
                className="h-min rounded-md w-full pl-2 placeholder:text-xs"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="absolute top-1 right-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-auto "
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-auto "
                  >
                    <path d="M17.94 17.94A9 9 0 0 1 12 20c-7 0-11-8-11-8a18.36 18.36 0 0 1 3.8-4.6" />
                    <path d="M9.88 9.88A3 3 0 0 1 12 9c1.66 0 3 1.34 3 3 0 .6-.18 1.16-.5 1.62" />
                    <path d="M3 3l18 18" />
                  </svg>
                )}
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                name=""
                id=""
                placeholder="Validation"
                className="h-min w-full rounded-md pl-2 placeholder:text-xs"
                value={enteredValidationCode} // Bind to enteredValidationCode
                onChange={(e) => setEnteredValidationCode(e.target.value)} // Update enteredValidationCode
              />
              <h3 className="text-customBlack absolute top-0 right-2 font-bold">
                {validationCode}
              </h3>
            </div>
            <button
              className=" font-bold text-sm text-white hover:text-blue-500"
              onClick={resetValidationCode} // Reset the code on click
            >
              Reset
            </button>

            <div className="flex flex-row gap-1 ">
              <button
                className={`bg-loginRedColor text-customWhite px-4 py-1 h-min font-bold text-sm ${
                  !isValidationCodeValid ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handelLogin}
                disabled={!isValidationCodeValid || !username || !password}
              >
                {isLoading ? (
                  "..."
                ) : (
                  <div className=" flex items-center justify-center gap-1">
                    <FaUser className="text-base" /> Login
                  </div>
                )}
              </button>

              {/* <button
                // onClick={openRegisterModal}
                className="bg-yellow-500 text-black px-3 py-1 whitespace-nowrap h-min font-medium text-sm flex items-center justify-center gap-1"
              >
                Sign Up <FaArrowUpRightFromSquare />
              </button> */}
            </div>
          </div>{" "}
        </>
      ) : (
        <>
          <div className="flex flex-row items-center justify-center gap-1 lg:gap-2 relative">
            <div className="lg:hidden flex flex-row   text-customWhite bg-signUpColor  rounded-[4px]  p-1  items-center ">
              <span>
                <CiDollar className="w-5  h-auto stroke-1" />
              </span>

              <h3 className="text-xs text-textYellowColor">Bet</h3>
            </div>
            <div className="flex flex-row items-center font-medium rounded-[4px]  bg-signUpColor lg:bg-none whitespace-nowrap text-[10px] lg:text-xs lg:border border-sliderButtonMediumGray text-textYellowColor  lg:text-customWhite relative">
              <div className="flex flex-row items-center md:py-1 hover:underline cursor-pointer  px-2 gap-0.5  md:gap-2">
                <h3 className="">
                  Main{" "}
                  <span className="font-bold ">
                    {" "}
                    PBU {loading ? "..." : singleUser?.balance || 0.0}
                  </span>
                </h3>
                <p className="">
                  {" "}
                  Exposure <span className="font-bold ">0.00</span>
                </p>
                <button className="text-[10px] border  px-3 rounded-md border-sliderButtonMediumGray">
                  +4
                </button>
              </div>
              <span className="border-l py-[6px] lg:py-1 px-1 text-customWhite lg:text-sliderButtonMediumGray border-customBlack lg:border-sliderButtonMediumGray">
                <IoReload
                  onClick={reloadBalance}
                  className={`w-4 h-auto stroke-2 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
              </span>
            </div>
            <span
              className="text-customWhite bg-signUpColor  rounded-[4px] p-1 lg:hidden"
              onClick={() => setSettingOpen((prev) => !prev)}
            >
              <IoSettingsSharp className="w-5 h-auto stroke-2" />
            </span>
            <div
              ref={accountRef}
              className="lg:flex hidden text-customWhite py-[5px] rounded-md font-medium text-xs flex-row items-center gap-1 border px-2 border-sliderButtonMediumGray cursor-pointer "
              onClick={() => setMyAccountOpen((prev) => !prev)}
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="white"
                  className="w-4 h-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 1114 0H5z"
                  />
                </svg>
              </span>
              <h3 className="hover:underline">My Account</h3>
            </div>
            {myAccountOpen && (
              <div
                className="absolute top-full left-1/2 w-[200px] bg-customWhite shadow-lg rounded-sm pb-2 font-medium mt-2 z-50"
                ref={modalRef}
              >
                <div
                  className=" text-customBlack"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div className="hover:bg-sliderButtonMediumGray hover:text-customWhite border-b border-customBlack ">
                    <div className="px-2 flex flex-row justify-between items-center text-sm">
                      <h3 className="">{user?.username}</h3>
                      <p className="text-[10px] border-l border-customBlack px-1">
                        GMT+6:0
                      </p>
                    </div>
                  </div>
                  {filteredProfileInformation.map((item, index) => (
                    <div
                      key={index}
                      className=" border-b border-sliderButtonMediumGray"
                    >
                      <button
                        key={item.id}
                        className="block w-full   px-2 text-left text-sm hover:text-customWhite hover:bg-sliderButtonMediumGray "
                        onClick={() => navigate(item.path)}
                      >
                        {item.name}
                      </button>
                    </div>
                  ))}
                  <div className="px-2 relative ">
                    <button
                      className="bg-logoutBlueColor text-customWhite text-sm  w-full font-bold rounded-md"
                      onClick={handleLogout}
                    >
                      LOGOUT
                    </button>
                    <span className="absolute top-[5px] text-sm text-customWhite right-1/3 translate-x-full   ">
                      <HiOutlineArrowRightStartOnRectangle className="w-4 h-auto stroke-[2]" />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      {isRegisterModalOpen && <RegistrationForm onClose={closeRegisterModal} />}
    </div>
  );
};

export default TopHeader;
