import { useEffect, useState } from "react";
import axios from "axios";
const Component = () => {
   // Constants
   const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
   const recognition = new SpeechRecognition();
   recognition.lang = "en";

   // States
   const [tasks, setTasks] = useState([]);
   const [word, setWord] = useState();

   // Use Effects
   useEffect(
      (_) => {
         if (!word) return;
         const voices = window.speechSynthesis.getVoices();
         const speech = new SpeechSynthesisUtterance();
         speech.text = check(word);
         speech.onend = () => checkIfQuestion(check(word, true));
         speech.voice = voices[1];
         speech.rate = 1;
         speech.pitch = 1;
         speech.volume = 1;
         window.speechSynthesis.speak(speech);
      },
      [word]
   );

   // Functions
   recognition.onstart = function () {
      console.log("You are talking now");
   };

   recognition.onresult = function (e) {
      console.log("You are stop talking.", e);
      setWord(e.results[e.resultIndex][0].transcript);
   };
   function start() {
      recognition.start();
   }
   function checkIfQuestion(msg) {
      if (!msg.endsWith("?")) return;
      start();
   }
   function check(msg, ifQuestion = false) {
      if (msg) {
         msg = msg.toLowerCase();
         if (msg.includes("hi martin")) {
            console.log(true);
            return "Hi Ali How Are You ?";
         } else if (msg.includes("i'm fine")) {
            return "always, can i help you ?";
         } else if (msg.includes("show my tasks")) {
            if (tasks.length) {
               return `You have ${tasks.length} Tasks today, ${tasks.join(
                  " and "
               )}`;
            }
            return "Enjoy Ali, You Dont Have Any Task Today.";
         } else if (msg.includes("add") && msg.includes("to my tasks")) {
            const result = `Your task added successfully`;
            if (ifQuestion) return result;
            const theTask = msg
               .replace("add", "")
               .replace("to my tasks", "")
               .trim();
            setTasks((s) => [...s, theTask]);
            return result;
         } else if (
            (msg.includes("remove") || msg.includes("delete")) &&
            msg.includes("from my tasks")
         ) {
            const result = `Your task deleted successfully`;
            if (ifQuestion) return result;
            const theTask = msg
               .replace("remove", "")
               .replace("from my tasks", "")
               .trim();
            const index = tasks.indexOf(theTask);
            if (index !== -1) {
               setTasks((s) => [...s.filter((s) => s !== theTask)]);
               return result;
            }
            return "This task not found in your tasks, ali.";
         } else if (msg === "no") {
            return "Ok ali.";
         } else if (msg.includes("what's your name")) {
            return "My name is martin";
         } else if (
            msg.includes("remove all tasks") ||
            msg.includes("clear my tasks")
         ) {
            if (tasks.length) {
               setTasks([]);
               return `Your tasks deleted successfully`;
            }
            return "You dont have any task to delete.";
         } else if (msg.includes("turn on light")) {
            axios.get("http://192.168.1.2:4000/control/on");
            return "Done Ali , anything more ?";
         } else if (msg.includes("turn off light")) {
            axios.get("http://192.168.1.2:4000/control/off");
            return "Done Ali, anything more ?";
         } else if (msg.includes("restart the computer")) {
            axios.get("http://192.168.1.2:4000/restart");
            return "Done Ali, anything more ?";
         }
         return "I don't Know What you say";
      }
   }
   // Test Voices
   const testVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log(voices.length);
      for (let i = 0; i <= voices.length; i++) {
         setTimeout((_) => {
            const speech = new SpeechSynthesisUtterance();
            speech.text = `This Is a Test Voice Number ${i}`;
            speech.rate = 1;
            speech.pitch = 1;
            speech.volume = 1;
            speech.voice = voices[0];
            window.speechSynthesis.speak("Hi Ali How Are You");
         }, 5000);
      }
   };
   return (
      <div className="mt-5 pt-5 text-center">
         <button onClick={start} className="btn btn-primary">
            Speak
         </button>
      </div>
   );
};

export default Component;
