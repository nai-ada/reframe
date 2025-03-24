import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import QuoteRandomizer from "../components/QuoteRandomizer";
import LeafIcon from "../assets/images/leaf.svg";
import NewEntryIcon from "../assets/images/new-entry-dash.svg";
import AllEntriesIcon from "../assets/images/all-entries-dash.svg";
import PageTransition from "../components/PageTransition";
import { Divider } from "@heroui/divider";

function Dashboard() {
  return (
    <PageTransition>
      <div>
        <div className="logo-container flex items-center justify-center mt-10 overflow-x-hidden">
          <h1 className="logo text-[26px] mr-1">
            Refra:<span className="logo-highlight font-thin">me</span>
          </h1>
          <img
            src={LeafIcon}
            alt="leaf icon"
            className="w-[26px] max-w-full self-center -mt-1"
          />
        </div>
        <div className="flex justify-left m-4 mt-10">
          <h2 className="text-[32px] font-semibold text-[#2e4b3b] text-left w-80">
            Ready for a new perspective?
          </h2>
        </div>
        <div className="justify-center mt-4 ont-figtree  p-4 pb-10 pt-10">
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <Link
              to="/new-entry"
              className="clickable-div border-2 border-[#519144] py-4 px-4 rounded-xl bg-[#e2ffdd] shadow-md text-center"
            >
              <div className="flex flex-col justify-center items-center">
                <img src={NewEntryIcon} alt="new entry" className="mb-2" />
                <span className="font-fustat text-[#519144] font-semibold">
                  New Entry
                </span>
              </div>
            </Link>

            <Link
              to="/all-entries"
              className="clickable-div border-2 border-[#336a81] py-4 px-4 rounded-xl bg-[#d8f3ff] shadow-md text-center"
            >
              <div className="flex flex-col justify-center items-center">
                <img src={AllEntriesIcon} alt="all entries" className="mb-2" />
                <span className="font-fustat text-[#336a81] font-semibold">
                  All Entries
                </span>
              </div>
            </Link>

            <Link
              to="#"
              className=" clickable-div border-2 border-[#336a81] flex flex-col justify-center items-center py-4 px-4 rounded-xl bg-[#d8f3ff] shadow-md text-center"
            >
              <span className="font-fustat text-[#336a81] font-semibold">
                My Progress
              </span>
              <p className="text-xs text-[#336a81] font-semibold mt-1">
                (Coming Soon)
              </p>
            </Link>

            <Link
              to="#"
              className="clickable-div border-2 border-[#519144] flex flex-col justify-center items-center py-4 px-4 rounded-xl bg-[#e2ffdd] shadow-md text-center"
            >
              <span className="font-fustat text-[#519144] font-semibold">
                My Goals
              </span>
              <p className="text-xs mt-1 text-[#519144] font-semibold">
                (Coming Soon)
              </p>
            </Link>
          </div>
        </div>
        <div className="flex justify-center w-full">
          <Divider
            className="my-1 h-[2px] w-[90%]"
            style={{ backgroundColor: "#A7CFB8" }}
          />
        </div>

        <QuoteRandomizer />
      </div>
    </PageTransition>
  );
}

export default Dashboard;
