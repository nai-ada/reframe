import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import BackArrow from "../assets/images/back-arrow.svg";
import ArrowRight from "../assets/images/right-arrow.svg";
import PageTransition from "../components/PageTransition";
import { supabase } from "../supabaseClient";

function AllEntriesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [entryData, setEntryData] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllEntries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      if (data) setEntries(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching entries:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear().toString().slice(-2);
    return `${month}/${day}/${year}`;
  };

  useEffect(() => {
    fetchAllEntries();
  }, []);

  return (
    <PageTransition>
      <div>
        <Navigation />
        <div className="flex justify-left m-2 mt-10">
          <Link to="/">
            <img src={BackArrow} alt="back arrow"></img>
          </Link>
        </div>

        {entryData ? (
          <div className="flex items-center justify-between m-4 ">
            <h1 className="text-[22px] pr-4">Entry {entryData.entry_num}</h1>
            <div className="flex items-center justify-between">
              <img
                src={Delete}
                alt="delete button"
                className="w-[20px]"
                onClick={handleDelete}
              ></img>
              <h2 className="text-[12px] ml-2">{formatDate(entryData.date)}</h2>
            </div>
          </div>
        ) : (
          <div className="m-4 ">
            <h1 className="text-[22px]">All Entries</h1>
            {loading ? (
              <p>Loading entries...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : (
              <div className="mt-10">
                {entries.length > 0 ? (
                  entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="border-2 border-green-500 rounded-lg p-3 mb-2 rounded cursor-pointer flex justify-between bg-gradient-to-r from-[#d8f3ff] to-[#e2ffdd]"
                      onClick={() => navigate(`/submitted-entry/${entry.id}`)}
                    >
                      <h2 className="text-medium">
                        Entry {entry.entry_num || "N/A"}
                      </h2>
                      <div className="flex flex-end items-center">
                        <p className="text-xs mr-2 text-[#3a3a3a] font-thin">
                          {formatDate(entry.date)}
                        </p>
                        <img
                          src={ArrowRight}
                          alt="right arrow icon"
                          className="w-[20px]"
                        ></img>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No entries found</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

export default AllEntriesPage;
