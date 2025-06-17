import SportsSlider from "../../Components/Sports/SportsSlider/SportsSlider";
import SportsHeader from "../../Components/Sports/SportsHeader/SportsHeader";

const Sports = () => {
  const allTabs = ["by Time", "by Competition"];
  return (
    <div className="lg:hidden">
      {/* <Marquee/> */}
      <SportsSlider />

      <SportsHeader allTabs={allTabs} />
    </div>
  );
};

export default Sports;
