import { useLocation, useParams } from "react-router-dom";
import { useGetGamesQuery } from "../../redux/features/allApis/gameApi/gameApi";

const DemoGame = () => {
  const { id } = useParams();
  const { data: games, isLoading, isError } = useGetGamesQuery();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-2xl font-bold text-red-500">
        Error loading games
      </div>
    );
  }

  const game = games?.find((game) => game?._id === id);
  console.log(location.pathname, id);

  if (!game) {
    return (
      <div className="text-center text-2xl font-bold text-red-500">
        Game not found
      </div>
    );
  }

  if (!game.link) {
    return (
      <div className="text-center text-2xl font-bold text-red-500">
        This game is not available to play
      </div>
    );
  }

  return (
    <div>
      <iframe
        className="w-full h-[600px] max-h-screen"
        src={game.link}
        frameBorder="0"
        allowFullScreen
        title={game.name || "Game"} // Always good to add title for accessibility
      ></iframe>
    </div>
  );
};

export default DemoGame;
