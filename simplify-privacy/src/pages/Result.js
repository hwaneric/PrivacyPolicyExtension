import { H4, H2, P } from '../components/ui/typography';
import Button from '@mui/material/Button';


function Result({summary, scores}) {
  const overallScore = 
    Object.values(scores).reduce((acc, value) => acc + value, 0) / Object.values(scores).length;
 
  return (
    <>
      <div className="my-4">
        <H4 className="text-center underline"> Privacy Score </H4>
        <div className="flex flex-row gap-8 items-center">
          <H2 className="text-center"> {overallScore} </H2>
          <div className="flex flex-col">
            {scores}
            {/* {Object.entries(scores).map(([category, score]) => (
              <P key={category}> {category}: {score} </P>
            ))} */}
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <H4 className="text-center underline"> Summary </H4>
        <P className="mx-4"> {summary} </P>
      </div>
    </>
  );
}

export default Result;
