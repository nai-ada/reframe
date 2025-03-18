import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

function EntryComparisons({ originalText, reframedText }) {
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
  const [scores, setScores] = useState("");
  const [error, setError] = useState("");
  const [apiCallMade, setApiCallMade] = useState(false);

  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const processText = useCallback(async () => {
    if (!originalText || apiCallMade) return;

    const cacheKey = originalText.substring(0, 100);

    if (responseCache[cacheKey]) {
      console.log("Using cached response");
      setScores(responseCache[cacheKey]);
      setIsLoading(false);
      return;
    }

    const scoresPrompt = `
    You are an AI mindset coach evaluating two entries.
    
    Based on overall positivity, mindset quality, and cognitive framing, assign a single score from 1-100% to each entry.
    
    Return ONLY two numbers, each on its own line, with no labels, explanations, or additional text:
    - First line: Percentage score for Original Entry
    - Second line: Percentage score for Reframed Entry
    
    Example of correct response format:
    X%
    Y%
    
    **Original Entry:**
    ${originalText}
    
    **Reframed Entry:**
    ${reframedText}
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
                  text: scoresPrompt,
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
      setScores(generatedText);
      setIsLoading(false);
    } catch (error) {
      console.error(
        "Error calling Gemini API:",
        error.response ? error.response.data : error.message
      );
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }, [originalText, reframedText, geminiApiKey, apiCallMade]);

  useEffect(() => {
    if (originalText && !apiCallMade) {
      processText();
    }
  }, [processText, originalText, apiCallMade]);

  return (
    <div>
      <div className="flex items-center mt-2 mb-2 ml-4">
        {isLoading && (
          <div className="flex flex-start items-center ml-3">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#A7CFB8] mr-2"></div>
          </div>
        )}
      </div>

      <div className="p-4 flex">
        {!isLoading ? (
          <div className="text-lg">{scores}</div>
        ) : (
          <div className="flex justify-center items-center h-[50px]">
            <div className="animate-pulse text-[#A7CFB8]">
              Calculating positivity scores...
            </div>
          </div>
        )}
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </div>
  );
}

export default EntryComparisons;
