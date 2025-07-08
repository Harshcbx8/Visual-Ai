import { MdContentCopy } from "react-icons/md";
import { toast } from 'react-toastify';
import DOMPurify from "dompurify";
import { TiTick } from "react-icons/ti";
import { MdError } from "react-icons/md";
import { cleanResponse } from "../cleanResponse";
export default function CopyButton({text}) {
  
  const handleCopy = (raw) => {
    // 1) Clean the raw into Markdown
    const md = cleanResponse(raw)
    // 2) Sanitize & extract plain text via DOMPurify
    const tmp = document.createElement('div')
    tmp.innerHTML = DOMPurify.sanitize(md)
    const purifiedText = tmp.textContent || ''
        
   navigator.clipboard.writeText(purifiedText)  .then(() => {
        toast.success("Text copied to clipboard!", {
          position: "bottom-right",
          autoClose: 500, // 1 second duration
          hideProgressBar: true, 
          icon : <TiTick/>
        });
      })
       .catch(err => {
         toast.error("Failed to copy text", {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: true, 
          icon: <MdError/>
          });
          console.error("Copy failed:", err);
     });
 };
  return (
    <button className="p-2 rounded-lg theme-button3 cursor-pointer" onClick={() => 
        {handleCopy(text); }}>
        <MdContentCopy />   
    </button>
  )
}
