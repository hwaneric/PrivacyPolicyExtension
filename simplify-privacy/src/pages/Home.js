/*global chrome*/
import { H4 } from '../components/ui/typography';
import Button from '@mui/material/Button';
import { stuff, mapReduce } from "../helpers/summarization";
import { naiveRubric, mapReduceRubric } from "../helpers/rate-rubric";
import { db } from '../firebase.config';
import { setDoc, doc, getDoc } from "firebase/firestore"; 
import React, { useEffect, useState } from 'react';


function Home({setLoading, setSummary, setError, setScores}) {
  const [currentURL, setURL] = useState(null);
  const [html, setHtml] = useState(null);

  useEffect(() => {
    (async () => {
      // see the note below on how to choose currentWindow or lastFocusedWindow
      const [tab] = await chrome.tabs.query({active:true, lastFocusedWindow: true});
      console.log(tab.url);
      let text = tab.url
      let index = text.indexOf("//");
      let endIndex = text.indexOf("/", index+2);
      let parsed = text.substring(index+2, endIndex);
      setURL(parsed)

      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "getSource") {
          console.log("HTML Source:", message.source);
          setHtml(message.source)
          // alert(message.source)
        }
      });

      function getScript() {
        const html = document.documentElement.outerHTML; // Get all HTML
        chrome.runtime.sendMessage({ action: "getSource", source: html }); // Send HTML to the background script
      };

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            func : getScript,
            // files: ["../src/helpers/htmlScript.js"], // Inject the script
          },
          () => {
            console.log("Content script injected!");
          }
        );
      });
    })();
  }, []);

  async function handleClick () {
    setLoading(true);

    let summary = "";
    let scores = {};

    const docRef = doc(db, "webURL", currentURL);
    const docSnap = await getDoc(docRef);

    // Domain is Cached
    if (docSnap.exists()) {
      summary = (docSnap.data().summary);
      scores = (docSnap.data().scores);
    } else {
      // If domain not cached, get new result and store in cache 
      
      const result = await mapReduce(html);
      // const result = await stuff(testText);
      if (result.status === 200) {
        summary = result.summary;        
        console.log(result.summary);
      }
      else {
        setError(true);
        return;
      }

      const ratingResult = await mapReduceRubric(html);  //PRIN change to actual text
      // const ratingResult = await naiveRubric(testText); //change to actual text
      if (ratingResult.status === 200) {
        scores = JSON.parse(ratingResult.ratings);
      }
      else {
        setError(true);
        return;
      }
      
      // Store new URL result
      await setDoc(docRef, {
        summary: summary,
        scores: scores,
      });
    }
        
    setSummary(summary);
    setScores(scores);
    setLoading(false)
  }
 
  return (
    <>
      {/* Insert Image here */}
      <H4 className="text-center"> Simplify Privacy Policies with One Click!</H4>
      <Button 
        variant="contained" 
        color="success"
        onClick={handleClick}
      >
        Summarize
      </Button>
    </>
  );
}

export default Home;
