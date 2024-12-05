import Loading from './pages/Loading.js';
import Home from './pages/Home.js';
import Result from './pages/Result.js';
import { H2, H4, P } from './components/ui/typography';


import { useState } from 'react';

import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [errorName, setErrorName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [summary, setSummary] = useState("");
  const [scores, setScores] = useState({});

  if (errorName !== "" || errorMsg !== "") {
    return (
      <div className="min-w-[380px] min-h-[480px] flex flex-col justify-center items-center gap-4">
        <H2 className="text-red-600"> Something Went Wrong... </H2>
        <H4> {errorName} </H4>
        <P> {errorMsg} </P>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-w-[380px] min-h-[480px] flex flex-col justify-center items-center gap-4">
        <Loading/>
      </div>
    )
  }

  // No summary yet, display homepage
  if (!summary) {
    return (
      <div className="min-w-[380px] min-h-[480px] flex flex-col justify-center items-center gap-4">
        <Home 
          setLoading={setLoading} 
          setSummary={setSummary} 
          setErrorName={setErrorName}
          setErrorMsg={setErrorMsg}
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
