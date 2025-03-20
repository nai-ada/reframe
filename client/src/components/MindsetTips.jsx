import React, { useEffect, useState, useCallback } from "react";
import { Spinner } from "@heroui/spinner";
import axios from "axios";

function MindsetTips({ originalText, updateTipsText }) {
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

  const [isLoading, setIsLoading] = useState(true);
  const [tipsText, setTipsText] = useState("");
  const [displayTipsText, setDisplayTipsText] = useState(false);
  const [error, setError] = useState("");
  const [apiCallMade, setApiCallMade] = useState(false);
  const [formattedTips, setFormattedTips] = useState([]);

  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const processText = useCallback(async () => {
    if (!originalText || apiCallMade) return;

    const cacheKey = originalText.substring(0, 100);

    if (responseCache[cacheKey]) {
      console.log("Using cached response");
      setTipsText(responseCache[cacheKey]);
      setIsLoading(false);
      setTimeout(() => {
        setDisplayTipsText(true);
      }, 300);
      return;
    }

    const tipsPrompt = `
    You are an AI mindset coach and therapist. Analyze the user's entry and provide 3 specific, actionable tips and reminders to help improve the user's mindset based on what they wrote. Focus on cognitive reframing techniques that directly address themes in their entry. Keep the tips incredibly concise and brief, only suggesting what is helpful to the user.
    
    FORMAT REQUIREMENTS (VERY IMPORTANT):
    - Format your response as a list with bullet points using ONLY the • character at the start of each tip
    - Do NOT use asterisks (*) or dashes (-)
    - Each tip should be on its own line
    - Include a blank line between each tip
    
    Example format:
    • First mindfulness tip goes here
    
    • Second cognitive reframing technique goes here
    
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
                  text: tipsPrompt,
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
      setTipsText(generatedText);
      setIsLoading(false);

      setTimeout(() => {
        setDisplayTipsText(true);
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

  useEffect(() => {
    if (tipsText) {
      if (updateTipsText) updateTipsText(tipsText);
      const lines = tipsText.split("\n");
      const formattedLines = lines.map((line, index) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("• ")) {
          return (
            <p key={index} className="mb-4">
              • <span className="text-sm">{trimmed.substring(2)}</span>
            </p>
          );
        }
        return <p key={index}>{line}</p>;
      });
      setFormattedTips(formattedLines);
    }
  }, [tipsText, updateTipsText]);

  return (
    <div>
      <div>
        <div className="flex items-center mt-24 mb-2 ml-4">
          <h2 className="text-xl">
            <span className="font-medium">Mindset Tips</span>
          </h2>

          {isLoading && (
            <div className="flex flex-start items-center ml-3">
              <Spinner color="success" size="sm" className="mr-2" />
            </div>
          )}
        </div>

        <div className="p-4 text-sm">
          {displayTipsText ? (
            <div
              style={{
                wordWrap: "break-word",
                overflowWrap: "break-word",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
                maxWidth: "100%",
              }}
            >
              {formattedTips}
            </div>
          ) : (
            <div className="flex justify-center items-center h-[50px]">
              <div className="animate-pulse text-[#A7CFB8]">
                Loading tips...
              </div>
            </div>
          )}
          {error && <div className="text-red-500">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default MindsetTips;
