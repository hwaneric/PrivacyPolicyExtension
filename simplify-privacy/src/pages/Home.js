import { H4 } from '../components/ui/typography';
import Button from '@mui/material/Button';
import OpenAI from "openai";
import { stuff, mapReduce } from "../helpers/summarization";



function Home({setLoading, setSummary, setError, setScores}) {
  // const secrets = require('../env.json');

  // const openai = new OpenAI();
  // const OPENAI_API_KEY = secrets.OPENAI_API_KEY;
  

  const testText = 
    `Data Collection: Personal details (e.g., name, email) and non-personal data (e.g., device info) are collected for services and improvements.
    Usage: Data is used for services, transactions, communication, and analytics.
    Sharing: Shared only with trusted third parties or for legal compliance.
    Security: Measures are in place to protect your information.
    Cookies: Used for functionality and personalization; users can manage settings.
    Third Parties: Not responsible for external sites linked on the platform.
    Your Rights: Access, edit, or delete your data; opt-out of marketing.
    Updates: Policy changes take effect when posted; check regularly.
    Contact: Reach out for questions or concerns.`;
  const testScores = {
    "Transparency": 4,
    "Data Sharing": 3,
    "Reputability": 5,
    "Past Behavior": 5,
  };

  const handleClick = async () => {
    setLoading(true);
    const result = await mapReduce(testText);
    // const result = await stuff();
    if (result.status === 200) {
      setSummary(result.summary);
      console.log(result.summary);
      setScores(testScores);
      setLoading(false);
    }
    else {
      setError(true);
    }

    // TODO: Add LLM/Score logic
    // TODO: If domain already cached, fetch cached result. 
    // TODO: If domain not cached, get new result and store in cache 
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
