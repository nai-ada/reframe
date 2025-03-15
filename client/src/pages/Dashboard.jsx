import { Link } from "react-router-dom";
import DropdownMenu from "../components/Navigation";
import QuoteRandomizer from "../components/QuoteRandomizer";
import LeafIcon from "../assets/images/leaf.svg";
import ArrowRight from "../assets/images/arrow-right.svg";
import { Divider } from "@heroui/react";

// add logic for if user is logged in they have access to this page and are directed here
// add logic to display username. get the data from supabase and display it that way
const welcomeUser = "User";

function Dashboard() {
  return (
    <div>
      <DropdownMenu />
      <div className="logo-container flex items-center justify-center mt-4 overflow-x-hidden">
        <h1 className="logo text-[30px] mr-1">
          Refra:<span className="logo-highlight font-thin">me</span>
        </h1>
        <img
          src={LeafIcon}
          alt="leaf icon"
          className="w-[36px] max-w-full self-center -mt-1"
        />
      </div>
      <div className="flex justify-center m-4">
        <h2 className="text-[30px] text-center">
          Ready for a new perspective,{" "}
          <span className="font-semibold text-[#A7CFB8]">{welcomeUser}</span>?
        </h2>
      </div>
      <div className="justify-center m-4 mt-20 flex-wrap">
        <div className="flex items-center justify-between">
          <Link to="/new-entry" className="my-4">
            New Entry
          </Link>
          <img src={ArrowRight} alt="arrow right" className="w-6 h-6" />
        </div>
        <Divider
          className="my-1 h-[2px]"
          style={{ backgroundColor: "#A7CFB8" }}
        />

        <div className="flex items-center justify-between">
          <Link to="/all-entries" className="my-4">
            My Entries
          </Link>
          <img src={ArrowRight} alt="arrow right" className="w-6 h-6" />
        </div>
        <Divider
          className="my-1 h-[2px]"
          style={{ backgroundColor: "#A7CFB8" }}
        />
      </div>
      <QuoteRandomizer />
    </div>
  );
}

export default Dashboard;
