import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link, useParams } from "react-router-dom";
import { Button } from "@heroui/react";
import ReactCardFlip from "react-card-flip";
import Navigation from "../components/Navigation";
import BackArrow from "../assets/images/back-arrow.svg";
import DeleteEntry from "../components/DeleteEntry";
import Tap from "../assets/images/tap.svg";
import Delete from "../assets/images/delete.svg";
import Edit from "../assets/images/edit.svg";
import PageTransition from "../components/PageTransition";
import { supabase } from "../supabaseClient";

function SubmittedEntryPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [entryData, setEntryData] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deleteEntry, setDeleteEntry] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const username = localStorage.getItem("username") || "User";

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleDelete = () => {
    if (entryData) {
      setEntryToDelete(entryData);
      setDeleteEntry(true);
    }
  };

  const fetchAllEntries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("entries").select("*");

      if (error) throw error;
      if (data) setEntries(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching entries:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteEntryById = async (id) => {
    try {
      const { error } = await supabase.from("entries").delete().eq("id", id);

      if (error) throw error;
      console.log("Entry deleted successfully");
      navigate("/all-entries", { replace: true });
    } catch (err) {
      console.error("Error deleting entry:", err);
    }
  };

  useEffect(() => {
    const fetchEntry = async () => {
      if (id) {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from("entries")
            .select("*")
            .eq("id", id)
            .single();

          if (error) throw error;
          if (data) setEntryData(data);
        } catch (err) {
          setError(err.message);
          console.error("Error fetching entry:", err);
        } finally {
          setLoading(false);
        }
      } else if (location.state && location.state.entryData) {
        setEntryData(location.state.entryData);
      } else {
        navigate("/", { replace: true });
      }
    };

    fetchEntry();
  }, [id, location.state, navigate]);

  useEffect(() => {
    fetchAllEntries();
  }, []);

  const formattedDate = entryData
    ? new Date(entryData.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  if (!entryData) {
    return (
      <PageTransition>
        <div>
          <div className="flex justify-center items-center h-[70vh]">
            <div className="text-center">
              <h2 className="text-xl mb-4">Loading entry data...</h2>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div>
        <div className="flex justify-left m-2 mt-10">
          <Link to="/">
            <img src={BackArrow} alt="back arrow" className=""></img>
          </Link>
        </div>
        <div className="flex items-center justify-left m-4 mb-0">
          <h1 className="text-[30px] pr-4">
            {entryData.entry_title || "Untitled Entry"}
          </h1>
        </div>
        <div className="flex items-center justify-between m-4 mt-0">
          <h2 className="text-[12px] mr-2">{formattedDate}</h2>
          <div className="justify-end flex">
            <img
              src={Edit}
              alt="edit button"
              className="w-[20px] mr-1 cursor-pointer"
              // onClick={handleEdit}
            ></img>
            <img
              src={Delete}
              alt="delete button"
              className="w-[20px] cursor-pointer"
              onClick={handleDelete}
            ></img>
          </div>
        </div>
        <div className="m-4">
          <div className="mb-6 mt-10 relative ">
            <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
              <div
                className="p-4 border-2 shadow-lg border-[#A7CFB8] rounded-lg mx-4 min-h-[200px] cursor-pointer bg-gradient-to-b from-[#e8f8ff] to-[#e2ffdd]"
                onClick={handleCardFlip}
              >
                <div className="flex justify-between mb-2 ">
                  <h3 className="text-medium">
                    <span className="font-semibold text-[#4b755e]">Refra:</span>
                    <span className="logo-highlight text-[#4b755e] font-thin">
                      me
                    </span>
                  </h3>
                  <div className="flex justify-between items-center gap-1">
                    <img src={Tap} alt="tap icon" className="w-[20px]"></img>
                    <span className="text-xs text-gray-500">Tap to flip</span>
                  </div>
                </div>
                <p
                  className="mt-6 break-words whitespace-pre-wrap"
                  style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
                >
                  {entryData.reframed_text}
                </p>
              </div>

              <div
                className="p-4 border border-gray-300 rounded-lg mx-4 min-h-[200px] cursor-pointer shadow-lg"
                onClick={handleCardFlip}
              >
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium text-[#4b755e]">{username}</h3>
                  <div className="flex justify-between items-center gap-1">
                    <img src={Tap} alt="tap icon" className="w-[20px]"></img>
                    <span className="text-xs text-gray-500">Tap to flip</span>
                  </div>
                </div>
                <p
                  className="mt-6 break-words whitespace-pre-wrap"
                  style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
                >
                  {entryData.original_text}
                </p>
              </div>
            </ReactCardFlip>
          </div>

          {entryData.mindset_tips && (
            <div className="mb-6 mt-16">
              <h2 className="text-xl font-medium mb-2 ml-4">Mindset Tips</h2>
              <div
                className="p-4 text-sm break-words whitespace-pre-wrap"
                style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
              >
                {entryData.mindset_tips.split("\n").map((line, index) => {
                  const trimmed = line.trim();
                  if (trimmed.startsWith("• ")) {
                    return (
                      <p key={index} className="mb-4 m-1">
                        •{" "}
                        <span className="text-xs break-words">
                          {trimmed.substring(2)}
                        </span>
                      </p>
                    );
                  }
                  return trimmed ? (
                    <p key={index} className="break-words">
                      {line}
                    </p>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {deleteEntry && entryToDelete && (
            <DeleteEntry
              setDeleteEntry={setDeleteEntry}
              id={entryToDelete.id}
              entryTitle={entryToDelete.entry_title}
              onDeleteSuccess={() => deleteEntryById(entryToDelete.id)}
            />
          )}

          <div className=" flex justify-center mr-4 ">
            <Link to="/all-entries">
              <Button
                radius="full"
                variant="solid"
                className="bg-gradient-to-tr from-[#6f9e75] to-[#9ae094] text-white shadow-lg"
              >
                All Entries
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default SubmittedEntryPage;
