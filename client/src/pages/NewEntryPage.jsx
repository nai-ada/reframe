import React, { useState } from "react";
import Navigation from "../components/Navigation";
import { Link, useNavigate } from "react-router-dom";
import BackArrow from "../assets/images/back-arrow.svg";
import { Textarea, Button } from "@heroui/react";
import PageTransition from "../components/PageTransition";

function NewEntryPage() {
  const navigate = useNavigate();
  const currentDate = new Date();
  const [entryText, setEntryText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [entryTitle, setEntryTitle] = useState("");

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleSubmit = () => {
    setErrorMessage("");

    if (!entryTitle.trim()) {
      setErrorMessage("Title is required.");
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
      },
    });
  };

  return (
    <PageTransition>
      <div>
        <Navigation />
        <div className="flex justify-left m-4 mt-10">
          <Link to="/">
            <img src={BackArrow} alt="back arrow" className=""></img>
          </Link>
        </div>
        <div className="flex items-center justify-between m-4">
          <h1 className="text-[22px] pr-4">New Entry</h1>
          <h2 className="text-[12px]">{formattedDate}</h2>
        </div>
        <div className="m-4">
          <Textarea
            maxRows={1}
            placeholder="Enter Title (max 10 characters)"
            size="sm"
            className="[&>div]:border-2 [&>div]:border-green-500 [&>div]:rounded-lg [&>div]:p-2 [&_textarea]:!h-full [&_textarea]:w-full [&_textarea]:border-none [&_textarea]:resize-none mb-4"
            value={entryTitle}
            onChange={(e) => setEntryTitle(e.target.value.slice(0, 10))}
          />
          <Textarea
            label="New Entry"
            minRows={50}
            size="lg"
            placeholder="Tell me about your day..."
            className="[&>div]:h-[400px] [&>div]:border-2 [&>div]:border-green-500 [&>div]:rounded-lg [&>div]:p-4 [&_textarea]:!h-full [&_textarea]:w-full [&_textarea]:border-none [&_textarea]:resize-none"
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
              className="bg-gradient-to-tr from-[#6f9e75] to-[#9ae094] text-white shadow-lg"
              radius="full"
              variant="solid"
              onPress={handleSubmit}
            >
              Reframe
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default NewEntryPage;
