import React, { useState } from "react";
import Navigation from "../components/Navigation";
import { Link } from "react-router-dom";
import BackArrow from "../assets/images/back-arrow.svg";
import { Textarea } from "@heroui/react";
import { Button } from "@heroui/react";
import axios from "axios";

function NewEntryPage() {
  const currentDate = new Date();
  const [entryText, setEntryText] = useState("");

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  //   connect to supabase to determine which entry this is based off all the user entry amounts + 1
  const entryNum = 1;

  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const handleSubmit = async () => {
    const prompt = `
      You are an AI trained to help reframe text into a positive perspective. Your task is to analyze the following user entry and identify any negative statements. Then, rework the text to reframe those statements into a positive perspective while keeping the original content as close as possible. Maintain the tone and style of the original text, but ensure the overall message is uplifting and optimistic.

      **User Entry:**
      ${entryText}

      **Reframed Text:**
    `;

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const generatedText = response.data.candidates[0].content.parts[0].text;
      console.log("Gemini API Response:", generatedText);
    } catch (error) {
      console.error(
        "Error calling Gemini API:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div>
      <Navigation />
      <div className="flex justify-left m-4 mt-10">
        <Link to="/">
          <img src={BackArrow} alt="back arrow" className=""></img>
        </Link>
      </div>
      <div className="flex items-center justify-between m-4">
        <h1 className="text-[22px] pr-4">Entry {entryNum}</h1>
        <h2 className="text-[12px]">{formattedDate}</h2>
      </div>
      <div className="m-4">
        <Textarea
          label="New Entry"
          maxRows={50}
          placeholder="Tell me about your day..."
          className="[&>div]:h-[400px] [&>div]:border-2 [&>div]:border-green-500 [&>div]:rounded-lg [&>div]:p-4 [&_textarea]:!h-full [&_textarea]:w-full [&_textarea]:border-none [&_textarea]:resize-none"
          value={entryText}
          onChange={(e) => setEntryText(e.target.value)}
        />
        <div className="mt-4 flex justify-end">
          <Button
            style={{ backgroundColor: "#A7CFB8", color: "" }}
            radius="full"
            variant="solid"
            onPress={handleSubmit}
          >
            Reframe!
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NewEntryPage;
