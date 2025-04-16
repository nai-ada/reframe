import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button, Accordion, AccordionItem } from "@heroui/react";
import PageTransition from "../components/PageTransition";
import MindsetTips from "../components/MindsetTips";
import EntryComparisons from "../components/EntryComparisons";
import axios from "axios";
import TypewriterEffect from "../components/TypewriterEffect";
import LeafIcon from "../assets/images/leaf.svg";
import { Spinner } from "@heroui/spinner";
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
  const { originalText, date, entryTitle, isEditing, entryId } =
    location.state || {};

  const [isLoading, setIsLoading] = useState(true);
  const [reframedText, setReframedText] = useState("");
  const [displayReframedText, setDisplayReframedText] = useState(false);
  const [error, setError] = useState("");
  const [apiCallMade, setApiCallMade] = useState(false);
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [mindsetTips, setMindsetTips] = useState("");
  const [savingEntry, setSavingEntry] = useState(false);

  const saveEntryToSupabase = async () => {
    if (savingEntry) return;
    setSavingEntry(true);

    if (!originalText || !reframedText || !entryTitle) {
      setError("Please complete all required fields before saving.");
      setSavingEntry(false);
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      setError("You must be logged in to save an entry.");
      setSavingEntry(false);
      return;
    }

    try {
      if (isEditing) {
        const { data, error } = await supabase
          .from("entries")
          .update({
            original_text: originalText,
            reframed_text: reframedText,
            entry_title: entryTitle,
            mindset_tips: mindsetTips,
          })
          .eq("id", entryId)
          .eq("user_id", user.id)
          .select();

        if (error) throw error;

        navigate(`/submitted-entry/${entryId}`, {
          state: {
            entryData: data[0],
            refresh: true,
          },
        });
      } else {
        const { data, error } = await supabase
          .from("entries")
          .insert([
            {
              original_text: originalText,
              reframed_text: reframedText,
              date: new Date(),
              entry_title: entryTitle,
              mindset_tips: mindsetTips,
              is_new: true,
              user_id: user.id,
            },
          ])
          .select();

        if (error) throw error;

        navigate("/success", { state: { entryData: data[0] } });
      }
    } catch (error) {
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

      const response = await fetch("/.netlify/functions/processEntry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;

      responseCache[cacheKey] = generatedText;

      setReframedText(generatedText);
      setIsLoading(false);

      setTimeout(() => {
        setDisplayReframedText(true);
      }, 300);
    } catch (error) {
      setIsLoading(false);
    }
  }, [originalText, apiCallMade]);

  useEffect(() => {
    if (originalText && !apiCallMade) {
      processText();
    }
  }, [processText, originalText, apiCallMade]);

  if (error) {
    return (
      <PageTransition>
        <div>
          <div className="flex justify-center items-center h-[70vh]">
            <div className="text-center">
              <h2 className="text-xl mb-4">{error}</h2>
              <Link
                to="/new-entry"
                className="bg-[#bae0b6] text-[#3a3a3a] font-medium shadow-lg rounded-xl mb-10"
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
          <div className="flex flex-col justify-center items-center h-[70vh]">
            <Spinner color="#A7CFB8" size="sm" className="mb-2" />
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
        <div className="flex items-center justify-between m-4 mt-10 mb-0">
          <h1 className="text-[22px] pr-4">{entryTitle}</h1>
        </div>

        <div className="flex items-center m-4 mt-1">
          <h2 className="text-[12px]">{date}</h2>
        </div>

        <div className="m-4">
          <div className="mb-6 mt-10">
            <h2 className="text-xl font-medium mb-2 ml-4">
              <span className="font-semibold text-[#A7CFB8]">Your</span> Entry
            </h2>
            <Accordion className="custom-accordion">
              <AccordionItem
                title={
                  <div className="text-md font-figtree text-gray-700 px-4">
                    {originalText.length > 20
                      ? `${originalText.substring(0, 20)}...`
                      : originalText}
                  </div>
                }
                textValue={`Your entry: ${originalText.substring(0, 50)}${
                  originalText.length > 50 ? "..." : ""
                }`}
                className="border border-gray-300 rounded-lg mx-2"
              >
                <div
                  className="p-4"
                  style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
                >
                  <p>{originalText}</p>
                </div>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-medium mb-2 ml-4">
              Refra:
              <span className="logo-highlight text-[#A7CFB8] font-thin">
                me
              </span>
              's Perspective
            </h2>
            <div
              className={`p-4 border-2 ${
                typewriterComplete ? "border-[#ADD8E6]" : "border-[#A7CFB8]"
              } rounded-lg mx-4 text-md font-figtree transition-colors duration-500 ease-in`}
              style={{
                wordWrap: "break-word",
                overflowWrap: "break-word",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
                maxWidth: "100%",
              }}
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

          <div className="border-t m-4 relative top-10 border-[#A7CFB8] border-1"></div>

          <MindsetTips
            originalText={originalText}
            updateTipsText={setMindsetTips}
          />

          <EntryComparisons
            originalText={originalText}
            reframedText={reframedText}
          />

          <div className="mt-6 flex justify-end mr-4">
            <Button
              className="bg-[#bae0b6] text-[#3a3a3a] font-medium shadow-lg mb-10"
              radius="xl"
              variant="solid"
              disabled={
                !typewriterComplete ||
                savingEntry ||
                !reframedText ||
                !mindsetTips
              }
              onPress={handleSubmitEntry}
            >
              {savingEntry
                ? "Saving..."
                : isEditing
                ? "Update Entry"
                : "Save Entry"}
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default EntryProcessingPage;
