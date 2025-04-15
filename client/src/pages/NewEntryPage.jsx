import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import BackArrow from "../assets/images/back-arrow.svg";
import Important from "../assets/images/important.svg";
import { Textarea, Button } from "@heroui/react";
import PageTransition from "../components/PageTransition";

function NewEntryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [entryText, setEntryText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [entryTitle, setEntryTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [entryId, setEntryId] = useState(null);

  useEffect(() => {
    if (location.state && location.state.editEntry) {
      const { id, entry_title, original_text } = location.state.editEntry;
      setEntryTitle(entry_title);
      setEntryText(original_text);
      setIsEditing(true);
      setEntryId(id);
    }
  }, [location]);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleSubmit = async () => {
    setErrorMessage("");

    if (!entryTitle.trim() && !entryText.trim()) {
      setErrorMessage("Please enter an entry title and content.");
      return;
    }

    if (!entryTitle.trim()) {
      setErrorMessage("An entry title is required to submit an entry.");
      return;
    }

    if (!entryText.trim()) {
      setErrorMessage("Content is required to submit an entry.");
      return;
    }

    navigate("/entry-processing", {
      state: {
        originalText: entryText,
        date: formattedDate,
        entryTitle: entryTitle.trim(),
        isEditing: isEditing,
        entryId: entryId,
      },
    });
  };

  return (
    <PageTransition>
      <div>
        <div className="flex justify-left m-4 mt-10">
          <Link to="/dashboard">
            <img src={BackArrow} alt="back arrow" className=""></img>
          </Link>
        </div>
        <div className="flex justify-center items-center mx-4 max-w-4xl px-4 py-2 mt-4 rounded-xl border-[#ffdf4e] border-2">
          <img src={Important} alt="Important" className="mr-2 flex-shrink-0" />
          <p className="text-[#EA3323] font-semibold text-[12px] ml-1 inline-flex items-center flex-wrap">
            Please note that this application is currently in Beta. All entries
            are publicly available and can be viewed by anyone using Refra:me.
            Please avoid writing down personal information when submitting an
            entry.
          </p>
        </div>

        <div className="flex items-center justify-between m-4">
          <h1 className="text-[22px] pr-4">
            {isEditing ? "Edit Entry" : "New Entry"}
          </h1>
          <h2 className="text-[12px]">{formattedDate}</h2>
        </div>
        <div className="m-4">
          <Textarea
            maxRows={1}
            placeholder="Enter Title (max 10 characters)"
            size="sm"
            className="[&>div]:border-2 [&>div]:border-[#83af7d] [&>div]:rounded-lg [&>div]:p-2 [&_textarea]:!h-full [&_textarea]:w-full  [&>div]:bg-white [&_textarea]:border-none [&_textarea]:resize-none mb-4"
            value={entryTitle}
            onChange={(e) => setEntryTitle(e.target.value.slice(0, 10))}
          />
          <Textarea
            label={isEditing ? "Edit Entry" : "New Entry"}
            minRows={50}
            size="lg"
            placeholder="Tell me about your day..."
            className="[&>div]:h-[400px] [&>div]:border-2 [&>div]:border-[#83af7d] [&>div]:rounded-lg [&>div]:p-4 [&_textarea]:!h-full [&>div]:bg-white [&_textarea]:w-full [&_textarea]:border-none [&_textarea]:resize-none"
            value={entryText}
            onChange={(e) => setEntryText(e.target.value)}
          />
          {errorMessage && (
            <div className="text-[#A7CFB8] mt-2 text-sm text-center">
              {errorMessage}
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <Button
              className="bg-[#bae0b6] text-[#3a3a3a] font-medium shadow-lg"
              radius="xl"
              variant="solid"
              onPress={handleSubmit}
            >
              {isEditing ? "Update" : "Reframe!"}
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default NewEntryPage;
