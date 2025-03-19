import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button, Accordion, AccordionItem } from "@heroui/react";
import Navigation from "../components/Navigation";
import PageTransition from "../components/PageTransition";
import MindsetTips from "../components/MindsetTips";
import EntryComparisons from "../components/EntryComparisons";
import axios from "axios";
import TypewriterEffect from "../components/TypewriterEffect";
import { supabase } from "../supabaseClient";

const responseCache = {};

const apiClient = axios.create();
const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS_PER_WINDOW = 5;
const requestTimestamps = [];

apiClient.interceptors.request.use(async (config) => {
  const now = Date.now();

  while (
    requestTimestamps.length > 0 &&
    requestTimestamps[0] < now - RATE_LIMIT_WINDOW
  ) {
    requestTimestamps.shift();
  }

  if (requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldestTimestamp = requestTimestamps[0];
    const timeToWait = RATE_LIMIT_WINDOW - (now - oldestTimestamp);

    await new Promise((resolve) => setTimeout(resolve, timeToWait));

    return apiClient.interceptors.request.handlers[0].fulfilled(config);
  }

  requestTimestamps.push(now);
  return config;
});

function EntryProcessingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { originalText, date, entryNum } = location.state || {};

  const [isLoading, setIsLoading] = useState(true);
  const [reframedText, setReframedText] = useState("");
  const [displayReframedText, setDisplayReframedText] = useState(false);
  const [error, setError] = useState("");
  const [apiCallMade, setApiCallMade] = useState(false);
  const [typewriterComplete, setTypewriterComplete] = useState(false);

  // state variables to store data from child components
  const [originalScore, setOriginalScore] = useState(0);
  const [reframedScore, setReframedScore] = useState(0);
  const [mindsetTips, setMindsetTips] = useState("");
  const [savingEntry, setSavingEntry] = useState(false);

  const username = localStorage.getItem("username") || "User";
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const saveEntryToSupabase = async () => {
    if (savingEntry) return;

    try {
      setSavingEntry(true);

      const { data, error } = await supabase
        .from("entries")
        .insert([
          {
            original_text: originalText,
            reframed_text: reframedText,
            date: new Date(),
            entry_num: entryNum,
            original_score: originalScore,
            reframed_score: reframedScore,
            mindset_tips: mindsetTips,
          },
        ])
        .select();

      if (error) throw error;
      navigate("/submitted-entry", { state: { entryData: data[0] } });
    } catch (error) {
      console.error("Error saving entry:", error);
      setError("Failed to save entry. Please try again.");
      setSavingEntry(false);
    }
  };

  const handleSubmitEntry = () => {
    saveEntryToSupabase();
  };

  const processText = useCallback(async () => {
    if (!originalText || apiCallMade) return;

    const cacheKey = originalText.substring(0, 100);

    if (responseCache[cacheKey]) {
      console.log("Using cached response");
      setReframedText(responseCache[cacheKey]);
      setIsLoading(false);
      setTimeout(() => {
        setDisplayReframedText(true);
      }, 300);
      return;
    }

    const prompt = `
      You are an AI trained to help reframe text into a positive perspective. Your task is to analyze the following user entry and identify any negative statements. Then, rework the text to reframe those statements into a positive perspective while keeping the original content as close as possible. Maintain the tone and style of the original text, but ensure the overall message is uplifting and optimistic. Keep this reframed entry as concise as possible, avoiding extra sentences.

      **User Entry:**
      ${originalText}

    `;

    try {
      setApiCallMade(true);

      const response = await apiClient.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
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

      responseCache[cacheKey] = generatedText;

      setReframedText(generatedText);
      setIsLoading(false);

      setTimeout(() => {
        setDisplayReframedText(true);
      }, 300);
    } catch (error) {
      console.error(
        "Error calling Gemini API:",
        error.response ? error.response.data : error.message
      );
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }, [originalText, geminiApiKey, apiCallMade]);

  useEffect(() => {
    if (originalText && !apiCallMade) {
      processText();
    }
  }, [processText, originalText, apiCallMade]);

  if (error) {
    return (
      <PageTransition>
        <div>
          <Navigation />
          <div className="flex justify-center items-center h-[70vh]">
            <div className="text-center">
              <h2 className="text-xl mb-4">{error}</h2>
              <Link
                to="/new-entry"
                className="bg-[#A7CFB8] text-white px-4 py-2 rounded-full"
              >
                Try Again
              </Link>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (isLoading && !reframedText) {
    return (
      <PageTransition>
        <div>
          <Navigation />
          <div className="flex flex-col justify-center items-center h-[70vh]">
            {/* loading spinner */}
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#A7CFB8] mb-4"></div>
            <h2 className="text-xl mb-2 text-[#A7CFB8]">Generating Entry...</h2>
            <p className="text-sm text-gray-500">This may take a moment</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!originalText) {
    return (
      <PageTransition>
        <div>
          <Navigation />
          <div className="flex justify-center items-center h-[70vh]">
            <div className="text-center">
              <h2 className="text-xl mb-4">No entry data available</h2>
              <Link
                to="/new-entry"
                className="bg-[#A7CFB8] text-white px-4 py-2 rounded-full"
              >
                Create a new entry
              </Link>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div>
        <Navigation />

        <div className="flex items-center justify-between m-4 mt-10">
          <h1 className="text-[22px] pr-4">Entry {entryNum}</h1>
          <h2 className="text-[12px]">{date}</h2>
        </div>

        <div className="m-4">
          <div className="mb-6 mt-10">
            <h2 className="text-xl font-medium mb-2 ml-4">
              <span className="font-semibold text-[#A7CFB8]">{username}</span>'s
              Entry
            </h2>

            <Accordion className="custom-accordion">
              <AccordionItem
                title={
                  <div className="text-sm text-gray-700 px-4">
                    {originalText.length > 20
                      ? `${originalText.substring(0, 20)}...`
                      : originalText}
                  </div>
                }
                textValue={`${username}'s entry: ${originalText.substring(
                  0,
                  50
                )}${originalText.length > 50 ? "..." : ""}`}
                className="border border-gray-300 rounded-lg mx-2"
              >
                <div className="p-4">
                  <p>{originalText}</p>
                </div>
              </AccordionItem>
            </Accordion>
          </div>

          <div className=" mb-6">
            <div className="flex items-center mb-2 ml-4">
              <h2 className="text-xl">
                <span className="font-semibold text-[#A7CFB8]">Refra:</span>
                <span className="logo-highlight text-[#A7CFB8] font-thin">
                  me
                </span>
                's Perspective
              </h2>

              {displayReframedText && !typewriterComplete && (
                <div className="flex flex-start items-center ml-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#A7CFB8] mr-2"></div>
                </div>
              )}
            </div>

            <div
              className={`p-4 border-2 ${
                typewriterComplete ? "border-[#ADD8E6]" : "border-[#A7CFB8]"
              } rounded-lg mx-4 text-sm transition-colors duration-500 ease-in`}
            >
              {displayReframedText ? (
                <TypewriterEffect
                  text={reframedText}
                  speed={15}
                  onComplete={() => setTypewriterComplete(true)}
                />
              ) : (
                <div className="flex justify-center items-center h-[50px]">
                  <div className="animate-pulse text-[#A7CFB8]">
                    Preparing to reframe...
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="border-1 m-4 relative top-10"></div>

          <div>
            <MindsetTips
              originalText={originalText}
              updateTipsText={setMindsetTips}
            />
          </div>

          <div>
            <EntryComparisons
              originalText={originalText}
              reframedText={reframedText}
              updateOriginalScore={setOriginalScore}
              updateReframedScore={setReframedScore}
            />
          </div>

          <div className="mt-6 flex justify-end mr-4">
            <Button
              style={{ backgroundColor: "#A7CFB8", color: "" }}
              radius="full"
              variant="solid"
              disabled={!typewriterComplete || savingEntry}
              onPress={handleSubmitEntry}
            >
              {savingEntry ? "Saving..." : "Submit Entry"}
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default EntryProcessingPage;
