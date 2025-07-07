import { toast } from 'react-toastify';
import { MdThumbUp, MdThumbDown } from "react-icons/md";

export default function LikeDislikeButtons() {

    const handleLike = () => {
     toast.success("Liked!", {
        position: "bottom-right",
        autoClose: 500,
        hideProgressBar: true,
        icon: <MdThumbUp />,
      });
    };
      
    const handleDislike = () => {
      toast.error("Disliked!", {
        position: "bottom-right",
        autoClose: 500,
        hideProgressBar: true,
        icon: <MdThumbDown />,
      });
    };

  return (
    <div className='flex gap-0.5'>  
    <button className="p-2 rounded-lg theme-button3 cursor-pointer" onClick={handleLike}> <MdThumbUp /> </button>
    <button className="p-2 rounded-lg theme-button3 cursor-pointer" onClick={handleDislike}> <MdThumbDown /> </button>
    </div>
  )
}
