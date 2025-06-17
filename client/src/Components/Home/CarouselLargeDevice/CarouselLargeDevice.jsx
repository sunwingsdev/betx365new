import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useGetGamesQuery } from "../../../redux/features/allApis/gameApi/gameApi";
import { useGetColorControlsQuery } from "../../../redux/features/allApis/colorControlApi/colorControlApi";

const CarouselLargeDevice = () => {
  const { data: games } = useGetGamesQuery();
  const { data: colorControls } = useGetColorControlsQuery();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const activatedGames = games?.filter((game) => game.isActive);
  const buttonColorControl = colorControls?.find(
    (colorControl) => colorControl?.section === "home-game-button"
  );

  const handlePlay = (id, link) => {
    if (link) {
      navigate(`/games/demo/${id}`);
    } else if (user) {
      toast.error("Please connect the API to play the game");
    } else {
      toast.error("Please login to play the game");
    }
  };

  // Function to determine column span class based on game's column property
  const getColumnClass = (columnValue) => {
    switch (columnValue) {
      case 2:
        return "md:col-span-2";
      case 3:
        return "md:col-span-3";
      case 4:
        return "md:col-span-4";
      default:
        return "md:col-span-1";
    }
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 px-2 lg:px-0 pt-3">
        {activatedGames?.map((item, i) => (
          <Link
            to={i === 0 ? "/inplay" : "#"}
            key={i}
            className={`relative ${getColumnClass(item.column)}`}
          >
            <img
              src={`${import.meta.env.VITE_BASE_API_URL}${item.image}`}
              alt={item.title}
              style={{
                border: "0 0 8px 0 solid",
                borderColor: buttonColorControl?.backgroundColor,
              }}
              className="w-full h-full border-b-8"
            />
            {i === 0 && (
              <div className="absolute pt-3 p-2 bg-customBlack70 text-sm top-0 right-0">
                <Link className="text-customWhite" to="/inplay">
                  <div className="flex items-center pb-2 animate-pulse">
                    <span className="bg-liveRedColor rounded-sm border-l-8 border-customWhite font-bold text-md px-2">
                      LIVE
                    </span>
                  </div>
                  <ul className="text-customWhite flex flex-col gap-x-5 gap-y-1">
                    <div className="flex flex-row justify-between gap-x-2">
                      <li>Cricket</li>
                      <span className="w-auto text-center px-1 rounded-sm bg-customWhite text-customBlack">
                        7
                      </span>
                    </div>
                    <div className="flex flex-row justify-between gap-x-5">
                      <li>Soccer</li>
                      <span className="w-auto text-center px-1 rounded-sm bg-customWhite text-customBlack">
                        14
                      </span>
                    </div>
                    <div className="flex flex-row justify-between gap-x-12">
                      <li>Tennis</li>
                      <span className="w-auto inline-block rounded-sm px-1 text-center bg-customWhite text-customBlack">
                        11
                      </span>
                    </div>
                  </ul>
                </Link>
              </div>
            )}
            <h3 className="absolute bottom-2 w-full text-customWhite text-left py-0.5 capitalize lg:px-2 px-2 md:px-4 font-bold bg-customBlack70 lg:text-sm text-xs">
              {item.title}
            </h3>
            <button
              className="absolute bottom-0 right-0 ps-6 pe-1 md:ps-8 md:pe-5 py-0.5 md:py-1.5 transform lg:text-sm font-medium"
              style={{
                clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
                backgroundColor: buttonColorControl?.backgroundColor,
                color: buttonColorControl?.textColor,
                fontSize:
                  window.innerWidth <= 768
                    ? `${parseFloat(buttonColorControl?.fontSize) - 4}px`
                    : buttonColorControl?.fontSize,
              }}
              onClick={() => handlePlay(item?._id, item?.link)}
            >
              Play Now
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CarouselLargeDevice;