import Loading from './pages/Loading.js';
import Home from './pages/Home.js';
import Result from './pages/Result.js';


import { useState } from 'react';

import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false)
  const [summary, setSummary] = useState("");
  const [scores, setScores] = useState({});


  if (loading) {
    return (
      <div className="min-w-[380px] min-h-[480px] flex flex-col justify-center items-center gap-4">
        <Loading/>
      </div>
    )
  }

  if (error) {
    return (
      // TODO: Add error handling page here
      <>
      </>
    )
  }

  // No summary yet, display homepage
  if (!summary) {
    return (
      <div className="min-w-[380px] min-h-[480px] flex flex-col justify-center items-center gap-4">
        <Home 
          setLoading={setLoading} 
          setSummary={setSummary} 
          setError={setError}
          setScores={setScores}
        />
      </div>
    );
  }

  // Summary received. Display summary page
  return (
    <div className="min-w-[380px] min-h-[480px] flex flex-col justify-center items-center gap-4">
      <Result summary={summary} scores={scores}/>
    </div>
  );
  
}

export default App;
