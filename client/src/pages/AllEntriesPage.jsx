import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import BackArrow from "../assets/images/back-arrow.svg";
import { Button } from "@heroui/react";
import ArrowRight from "../assets/images/right-arrow.svg";
import Add from "../assets/images/add.svg";
import PageTransition from "../components/PageTransition";
import DeleteAllEntries from "../components/DeleteAllEntries";
import Delete from "../assets/images/delete.svg";
import { supabase } from "../supabaseClient";

function AllEntriesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [entryData, setEntryData] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteAllEntries, setDeleteAllEntries] = useState(false);
  const [entriesToDelete, setEntriesToDelete] = useState(null);
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
  }, [location.state?.refresh]);

  const handleDelete = () => {
    setEntriesToDelete(entries);
    setDeleteAllEntries(true);
  };

  const deleteEntries = async (ids = null) => {
    try {
      setLoading(true);
      let query = supabase.from("entries").delete();

      if (ids) {
        query = query.in("id", ids);
      } else {
        query = query.neq("id", 0);
      }

      const { error } = await query;

      if (error) throw error;
      console.log(
        ids
          ? "Selected entries deleted successfully"
          : "All entries deleted successfully"
      );
      await fetchAllEntries();
    } catch (err) {
      setError(err.message);
      console.error("Error deleting entries:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAllEntriesConfirmed = () => {
    deleteEntries();
    setDeleteAllEntries(false);
  };

  const markEntryAsViewed = async (entryId) => {
    try {
      const { error } = await supabase
        .from("entries")
        .update({ is_new: false })
        .eq("id", entryId);

      if (error) throw error;
    } catch (err) {
      console.error("Error marking entry as viewed:", err);
    }
  };

  const isEntryNew = (entry) => {
    if (entry.is_new === false) return false;
    if (entry.is_new === true) return true;

    const entryDate = new Date(entry.created_at || entry.date);
    const now = new Date();
    const hoursDiff = (now - entryDate) / (1000 * 60 * 60);
    return hoursDiff < 24;
  };

  return (
    <PageTransition>
      <div>
        <div className="flex justify-left m-2 mt-10">
          <Link to="/dashboard">
            <img src={BackArrow} alt="back arrow"></img>
          </Link>
        </div>

        {entryData ? (
          <div className="flex items-center justify-between m-4 ">
            <h1 className="text-medium">
              {entry.entry_title || "Untitled Entry"}
            </h1>
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
            <div className="flex justify-between items-center">
              <h1 className="text-[22px]">All Entries</h1>
              <div className="justify-end flex items-center">
                <img
                  src={Delete}
                  alt="delete button"
                  className="w-[20px] cursor-pointer"
                  onClick={handleDelete}
                ></img>
                <h3
                  onClick={handleDelete}
                  className="my-4 text-xs ml-[0.1rem] cursor-pointer "
                >
                  Delete All
                </h3>

                <Link
                  to="/new-entry"
                  className="my-4 text-xs flex items-center"
                >
                  <img
                    src={Add}
                    alt="add button"
                    className="w-[20px] cursor-pointer ml-4 mr-[0.2rem]"
                  ></img>
                  Add New
                </Link>
              </div>
            </div>

            {deleteAllEntries && (
              <DeleteAllEntries
                setDeleteAllEntries={setDeleteAllEntries}
                entryTitle="all entries"
                onDeleteSuccess={deleteAllEntriesConfirmed}
              />
            )}

            {loading ? (
              <p>Loading entries...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : (
              <div className="mt-10 mb-14">
                {entries.length > 0 ? (
                  entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="border-1 border-[#A7CFB8] rounded-lg p-3 mb-4 cursor-pointer flex justify-between bg-gradient-to-r from-[#d8f3ff] to-[#e2ffdd] shadow-md relative"
                      onClick={() => {
                        if (isEntryNew(entry)) {
                          markEntryAsViewed(entry.id);
                        }
                        navigate(`/submitted-entry/${entry.id}`);
                      }}
                    >
                      {isEntryNew(entry) && (
                        <div className="absolute -top-2 -right-2 bg-[#5ea7c4b6] text-white px-2 py-1 rounded-xl text-xs font-figtree font-semibold animate-pulse">
                          New!
                        </div>
                      )}

                      <h2 className="text-medium">
                        {entry.entry_title || "Untitled Entry"}
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
                  <div className="flex-col flex justify-center items-center text-sm mt-48">
                    <p className="text-medium mb-6">No entries found.</p>
                    <Link to="/new-entry">
                      <Button
                        className="bg-[#bae0b6] text-[#3a3a3a] font-medium shadow-lg mb-10"
                        radius="xl"
                        variant="solid"
                      >
                        Add New Entry
                      </Button>
                    </Link>
                  </div>
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
