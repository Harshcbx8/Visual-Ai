import { MdContentCopy } from "react-icons/md";
import { toast } from 'react-toastify';
import DOMPurify from "dompurify";
import { TiTick } from "react-icons/ti";
import { MdError } from "react-icons/md";
export default function CopyButton({text}) {
    
const handleCopy = (text) => {
   const tempDiv = document.createElement("div");
   tempDiv.innerHTML = DOMPurify.sanitize(text);
   const purifiedText = tempDiv.textContent || tempDiv.innerText;
        
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
