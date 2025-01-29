import speech_recognition as sr
import pyttsx3

def say(text):
     # Initialize the text-to-speech engine
    engine = pyttsx3.init()
    engine.say(text)
    engine.runAndWait()

def takeCommand():
    r = sr.Recognizer()
      
    try:
        with sr.Microphone() as source:
            print("Adjusting for ambient noise, please wait...")
            r.adjust_for_ambient_noise(source, duration=1)  # Adjust for ambient noise
            print("Listening...")
            audio = r.listen(source, timeout=10, phrase_time_limit=10)  # Listen for a command
            print("Recognizing...")
            query = r.recognize_google(audio, language="en-in")  # Use Google Speech Recognition
            print(f"User said: {query}")
            return query
    except sr.UnknownValueError:
        print("Sorry, I could not understand the audio.")
        return ""
    except sr.RequestError as e:
        print(f"Could not request results; {e}")
        return ""
    except Exception as e:
        print(f"An error occurred: {e}")
        return ""
    
    
if __name__ == '__main__':
     print('pycharm')
     say("hey whats up")
     print("Listening....")
     text = takeCommand()
     if text:
        say(f"You said: {text}")
     else:
        say("I couldn't understand what you said.")