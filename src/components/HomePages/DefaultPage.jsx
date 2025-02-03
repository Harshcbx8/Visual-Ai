import React, { useMemo } from "react";
import { FaMicrophone, FaRegImage, FaFileAlt, FaBrain, FaCommentDots, FaCode} from "react-icons/fa";
import { motion } from "framer-motion";
import { LuTextCursorInput } from "react-icons/lu";
import { LuBrainCircuit } from "react-icons/lu";
import { GoHubot } from "react-icons/go";
import { SiModal } from "react-icons/si";
import { GrSearchAdvanced } from "react-icons/gr";
import { IoImage } from "react-icons/io5";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { FaGamepad } from "react-icons/fa6";
import { MdGesture } from "react-icons/md";
import { DiAtom } from "react-icons/di";
import { TbLanguageHiragana } from "react-icons/tb";
import { LiaChartAreaSolid } from "react-icons/lia";
import { BiSolidConversation } from "react-icons/bi";
import { FcMindMap } from "react-icons/fc";
import { TbTextGrammar } from "react-icons/tb";
import { LiaBrainSolid } from "react-icons/lia";
import { SiWeightsandbiases } from "react-icons/si";
import { GiProcessor } from "react-icons/gi";
import { SiKingstontechnology } from "react-icons/si";
import { SiCodemagic } from "react-icons/si";
import { BsRobot } from "react-icons/bs";
import { TbDatabaseSearch } from "react-icons/tb";



export default function DefaultPage({ aiModel, width }) {
  // AI Model-Specific Features
  const modelFeatures = {
    Gemini: [
      { icon: <LuBrainCircuit size={30} />, title: "AI-driven Insights", description: "Utilizes AI to analyze and generate intelligent responses" },
      { icon: <GoHubot size={30} />, title: "Human-like Interaction", description: "Engages users in natural conversations, adapting dynamically" },
      { icon: <LuTextCursorInput size={30} />, title: "Text Generation", description: "Generates human-like text for various use cases" },
      { icon: <FaCode size={30} />, title: "Code Assistance", description: "Helps with code generation, debugging, and explanations" },
      { icon: <SiModal size={30} />, title: "Multimodal AI", description: "Processes text, images, and more for a seamless AI experience" },
      { icon: <GrSearchAdvanced size={30} />, title: "Advanced Reasoning", description: "Understands complex queries and provides deep insights" },
    ],
    "VISUAL-AI": [
        { icon: <FaMicrophone size={30} />, title: "Voice Interaction", description: "Real-time voice input and output for interactive conversations" },
        { icon: <IoImage size={30} />, title: "Image Recognition", description: "Generates and recognizes creative images, objects, faces, and text" },
        { icon: <MdOutlineDocumentScanner size={30} />, title: "Document Modification", description: "Scans, edits, and extracts data from documents for management" },
        { icon: <FaGamepad size={30} />, title: "Gaming with AI", description: "Provides intelligent, interactive gaming experiences with real-time AI" },
        { icon: <MdGesture size={30} />, title: "Gesture-Based Task", description: "Uses camera to recognize gestures for hands-free task control" },
        { icon: <DiAtom  size={30} />, title: "VISUAL Assistant", description: "Interactive globe visualizing AI's real-time processes and cognitive activities." },
    ],

    "GPT-4.0": [
        { icon: <LuTextCursorInput size={30} />, title: "Text Generation", description: "Generates human-like text with deep contextual awareness"  },
        { icon: <FaCode size={30} />, title: "Coding & Debugging", description: "Advanced coding support, explanations, and fixes" },
        { icon: <LiaChartAreaSolid  size={30} />, title: "Reasoning & Decision Making",  description: "Handles complex reasoning and problem-solving tasks" },
        { icon: <FaRegImage size={30} />, title: "Image Generation", description: "Generates images based on textual prompts" },
        { icon: <TbLanguageHiragana size={30} />, title: "Multilingual Support", description: "Translates and generates text in multiple languages" },
        { icon: <FcMindMap  size={30} />, title: "Contextual Understanding", description: "Understands complex queries and responds with relevant insights" }
     ],

    "Llama-3": [
        { icon: <TbTextGrammar size={30} />, title: "Fast Text Processing", description: "Optimized for speed and efficiency in NLP tasks" },
        { icon: <BiSolidConversation size={30} />, title: "Conversational AI", description: "Engages in real-time natural conversations" },
        { icon: <FaFileAlt size={30} />, title: "Text Summarization", description: "Summarizes large amounts of text quickly and accurately" },
        { icon: <LiaBrainSolid size={30} />, title: "Contextual Reasoning", description: "Handles reasoning tasks and provides context-aware answers" },
        { icon: <SiModal size={30} />, title: "Multimodal Inputs", description: "Processes both text and basic image inputs for diverse use cases" },
        { icon: <GrSearchAdvanced size={30} />, title: "Search Optimization", description: "Helps in fine-tuning search queries for better results" },
    ],

    "Claude-Next": [
        { icon: <SiCodemagic size={30} />, title: "Multitasking AI", description: "Handles multiple requests with optimized performance" },
        { icon: <SiKingstontechnology size={30} />, title: "Knowledge Synthesis", description: "Combines data from various sources for intelligent responses" },
        { icon: <BsRobot size={30} />, title: "Advanced Dialogue", description: "Enables deep and sophisticated conversations with AI" },
        { icon: <FaRegImage size={30} />, title: "Image Analysis", description: "Analyzes and interprets images alongside text inputs" },
        { icon: <FaBrain size={30} />, title: "Complex Problem Solving", description: "Solves multi-step problems efficiently" },
        { icon: <TbDatabaseSearch size={30} />, title: "Data Integration", description: "Integrates large datasets to generate insightful responses" },
    ],

    "Mistral-AI": [
        { icon: <SiWeightsandbiases size={30} />, title: "Lightweight AI", description: "Runs efficiently on low-resource environments" },
        { icon: <GiProcessor size={30} />, title: "Rapid Processing", description: "Processes inputs quickly with minimal computation" },
        { icon: <FaCommentDots size={30} />, title: "Fast Conversation", description: "Enables quick and responsive conversations with minimal latency" },
        { icon: <FaCode size={30} />, title: "Code Interpretation", description: "Interprets and explains code effectively in different programming languages" },
        { icon: <TbLanguageHiragana size={30} />, title: "Multilingual Capability", description: "Supports several languages for global use" },
        { icon: <LiaChartAreaSolid size={30} />, title: "Efficient Data Analysis", description: "Analyzes large datasets in minimal time" },
    ],
    };

  // Memoize features for the selected AI model
  const features = useMemo(() => modelFeatures[aiModel] || [], [aiModel]);

  // Full Form for VISUAL-AI
  const visualFullForm = aiModel === "VISUAL-AI" && (
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold text-white">VISUAL</h2>
      <p className="text-gray-400 text-lg">
        <strong>Vast Interactive Simple User-friendly Application Language</strong>
      </p>
    </div>
  );

  return (
    <div className={`-z-10 absolute flex flex-col items-center justify-center w-full text-white p-8  ${width<520? "h-[65vh]": "h-[80vh]"}`}>
      
      {visualFullForm} {/* Display the full form for VISUAL-AI model */}
      
      <motion.div
        className={`grid  grid-cols-2 md:grid-cols-3 gap-6 self-center ${width<520? "w-[100%]" : "w-[80%]"}`}
        key={aiModel}  // Ensures re-animation when model changes
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{
          duration: 0.8,  // Slightly longer for smoother transition
          ease: "easeInOut",  // Smooth in-out easing for a fluid animation
        }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="rounded-2xl shadow-lg p-2 text-center hover:scale-105 hover:bg-zinc-900 transition-all duration-300"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{
                duration: 0.8,  // Ensures smooth transition
                ease: "easeInOut",  // Smooth start and end animation
                delay: index * 0.1,  // Optional: adds a slight delay between features
            }}
          >
            <div className="flex justify-center mb-4 text-white">
              {feature.icon}
            </div>
            <h2 className={`${width<520? "text-sm": "text-xl"} font-semibold mb-2`}>{feature.title}</h2>
            {/* Conditionally render the description based on width */}
            {width > 520 && <p className="text-gray-400">{feature.description}</p>}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}