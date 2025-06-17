import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import HeadingNavbar from "./HeadingNavbar";
import toast from "react-hot-toast";
import { useGetHomeControlsQuery } from "../../redux/features/allApis/homeControlApi/homeControlApi";
import { useFetchUser } from "../../hooks/customHook";

const CommonNavMenu = () => {
  const { data: homeControls } = useGetHomeControlsQuery();
  const { user, singleUser } = useSelector((state) => state.auth);
  const { fetchUser } = useFetchUser(user?._id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const control = homeControls?.find(
    (control) => control.category === "logo" && control.isSelected
  );

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    toast.success("Logout successful");
    navigate("/");
  };

  return (
    <div>
      <div>
        <div className="flex flex-row md:justify-between lg:justify-between bg-gray-800">
          <Link to="/" className="pt-4 pb-4">
            <img
              src={`${import.meta.env.VITE_BASE_API_URL}${control?.image}`}
              alt=""
              className="w-12 lg:w-full lg:max-w-full lg:h-12"
            />
          </Link>
          <div className="md:pl-4 lg:pl-0 ml-1 md:ml-0 lg:ml-0 pt-0 lg:pt-6 flex flex-wrap lg:flex-row  justify-center items-center pr-2 space-x-2">
            <p className="text-white text-xs lg:text-xl ">
              {user?.username}{" "}
              <span className="text-xs normal-case">({user?.role})</span>{" "}
              <span className="text-yellow-500 text-xs lg:text-xl">
                - Main Balance:
              </span>{" "}
              <span className="text-gray-100 text-xs">
                {singleUser?.balance || 0} PBU{" "}
              </span>{" "}
            </p>
            <button
              onClick={() => fetchUser()}
              className="pl-1 mt-2 size-7 bg-gray-900 hover:bg-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4 text-gray-100"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M21 12a9 9 0 11-6.219-8.56m.219-2.44V5m4-4H16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={handleLogout}
              className="pl-1 mt-2 size-7 bg-gray-900 rounded-sm hover:bg-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4 text-gray-100"
                viewBox="0 0 512 512"
                fill="currentColor"
              >
                <path d="M160 448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V64c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32v384zm32-200h235.5l-73.6-72.5c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3l-128 128c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l73.6-72.5H192c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
              </svg>
            </button>
          </div>
        </div>
        <div className=" bg-gray-800  ">
          <HeadingNavbar></HeadingNavbar>
        </div>
        <div className="bg-slate-800 pt-0  ">
          <div className="pl-0 lg:pl-4 flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-6 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 0014 0h-2zm-4 6v3h-2v-3h-2a4 4 0 008 0h-2z" />
            </svg>

            <div className="w-6 h-6 b border-r  pr-5 rounded-full   flex items-center justify-center ">
              <p className="transform text-white  text-xs">News</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonNavMenu;
