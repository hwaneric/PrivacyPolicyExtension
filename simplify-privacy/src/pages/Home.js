/*global chrome*/
import { H4 } from '../components/ui/typography';
import Button from '@mui/material/Button';
import { db } from '../firebase.config';
import { setDoc, doc, getDoc } from "firebase/firestore"; 
import React, { useEffect, useState } from 'react';


function Home({setLoading, setSummary, setError, setScores}) {
  const [currentURL, setURL] = useState(null);

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
    })();
  }, []);

  async function handleClick () {
    setLoading(true);

    let testSummary = `Data Collection: Personal details (e.g., name, email) and non-personal data (e.g., device info) are collected for services and improvements.
Usage: Data is used for services, transactions, communication, and analytics.
Sharing: Shared only with trusted third parties or for legal compliance.
Security: Measures are in place to protect your information.
Cookies: Used for functionality and personalization; users can manage settings.
Third Parties: Not responsible for external sites linked on the platform.
Your Rights: Access, edit, or delete your data; opt-out of marketing.
Updates: Policy changes take effect when posted; check regularly.
Contact: Reach out for questions or concerns.`;
    let testScores = {
      "Transparency": 4,
      "Data Sharing": 3,
      "Reputability": 5,
      "Past Behavior": 5,
    };

    const docRef = doc(db, "webURL", currentURL);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      //console.log("Document data:", docSnap.data());
      testSummary = (docSnap.data().summary);
      testScores = (docSnap.data().scores);
    } else {
      // If domain not cached, get new result and store in cache 
      // TODO: Add LLM/Score logic

      // Store new URL result
      await setDoc(docRef, {
        summary: testSummary,
        scores: testScores,
      });

      console.log("No such document!");
    }
        
    setSummary(testSummary);
    setScores(testScores);
    setLoading(false)
  }
 
  return (
    <>
      {/* Insert Top Image here */}
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
