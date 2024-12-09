/*global chrome*/
import { H4 } from '../components/ui/typography';
import Button from '@mui/material/Button';
import { mapReduce } from "../helpers/summarization";
import { naiveRubric, mapReduceRubric } from "../helpers/rate-rubric";
import { db } from '../firebase.config';
import { setDoc, doc, getDoc } from "firebase/firestore"; 
import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';


function Home({setLoading, setSummary, setErrorName, setErrorMsg, setScores}) {
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

    let summary = "The document outlines Netflix's Privacy Statement and its associated HTML and CSS structures for cookie consent and privacy compliance. It details the design and functionality of the OneTrust cookie consent banner, emphasizing responsive design, user interaction, and accessibility through styled buttons and layouts. The document includes technical specifications for CSS that enhance the visibility, usability, and aesthetics of the consent management interface across various devices. It also describes Netflix's data collection practices, user privacy rights, and compliance with regional privacy regulations, particularly for U.S. residents under the CCPA. Key features include user control over personal information, options for managing cookie preferences, and guidelines for data sharing and security. Additionally, it highlights Netflix's customer service interface and localization efforts, ensuring user feedback is integrated into their services.";
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
      if (result.status === 200) {
        summary = result.summary;        
        console.log(result.summary);
      }
      else {
        setErrorName(result.error_name);
        setErrorMsg(result.error_msg);
        return;
      }

      let ratingResult;

      if (result.isSmall) {
        ratingResult = await mapReduceRubric(html);
      } else {
        ratingResult = await naiveRubric(summary);
      }

      if (ratingResult.status === 200) {
        scores = JSON.parse(ratingResult.ratings);
      }
      else {
        setErrorName(ratingResult.error_name);
        setErrorMsg(ratingResult.error_msg);
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
      <img src={logo} alt="Logo" />;
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
