import MarkdownWithCopy from "../DATA/MarkdownWithCopy";
import { RiRobot3Fill } from 'react-icons/ri';
import { LuBrainCircuit } from 'react-icons/lu';
import CopyButton from './UI-Components/CopyButton';
import LikeDislikeButtons from "./UI-Components/LikeDislikeButtons";
import HandleTextToSpeech from "../StructureComp/UI-Components/HandleTextToSpeech";

export default function BotOutput({ message, currentWidth }) {
 
  return (
    <div className="themebot w-fit max-w-[100%] sm:text-sm text-xs"
            onMouseEnter={(e) => {
              if (currentWidth > 520) {
                e.currentTarget.querySelector(".icons-container").style.opacity = 1;
              }
            }}
            onMouseLeave={(e) => {
              if (currentWidth > 520) {
                e.currentTarget.querySelector(".icons-container").style.opacity = 0;
              }
            }}
    >      
         
       <div className="overflow-x-scroll overflow-y-hidden custom-scrollbar-horizontal" >
        {message.isLoading?(
               <span className="flex items-center theme-text animate-pulse">
               <LuBrainCircuit className=" text-sm sm:text-lg opacity-75" />
               <span className="ml-2">Thinking....</span>
              </span>
            ) : !message.text? (
                  <RiRobot3Fill className="text-sm sm:text-lg ml-1" />
             
           ):(
          <div className="px-2 pb-1 rounded-lg custom-scrollbar-horizontal overflow-x-visible">
              <MarkdownWithCopy text={message.text} />
            <div className={`icons-container  flex gap-0.5 ${currentWidth > 520 ? "opacity-0 transition-opacity duration-300" : "opacity-100"}`}    >                  
              <CopyButton text={message.text} />
              <HandleTextToSpeech message={message} />
              <LikeDislikeButtons />
            </div>
         </div>
          )}
      </div>
    </div>
  );
}
