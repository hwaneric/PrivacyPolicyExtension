import { H2 } from '../components/ui/typography';
import Button from '@mui/material/Button';
import { Loader } from 'lucide-react'


function Loading() {
  return (
    <>
      {/* Insert Top Image here */}
      <Loader className="animate-spin"/>
      <H2 className="px-6">Loading your summary...</H2>
      
    </>
  );
}

export default Loading;
