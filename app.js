const btn = document.querySelector('.talk');
const content = document.querySelector('.content');
let cameraStream = null;
let audio = null; // To store the song audio

// Speak function
function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;
    window.speechSynthesis.speak(text_speak);
}

// Greeting based on time
function wishMe() {
    let hour = new Date().getHours();
    let greeting = hour < 12 ? "Good Morning Ragul..." : hour < 17 ? "Good Afternoon Ragul..." : "Good Evening Ragul...";
    speak(greeting);
}

// Initialize assistant on page load
window.addEventListener('load', () => {
    speak("Initializing MEENU...");
    wishMe();
});

// Speech recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    content.textContent = transcript;
    takeCommand(transcript);
};

btn.addEventListener('click', () => {
    if (content.textContent !== "Listening...") {
        content.textContent = "Listening...";
        recognition.start();
    }
});

// Command handling function
function takeCommand(message) {
    if (message.includes('hello') || message.includes('hey')) {
        speak("Hello Sir, How May I Help You?");
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening YouTube...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } else if (message.includes("time")) {
        speak("The current time is " + new Date().toLocaleTimeString());
    } else if (message.includes("date")) {
        speak("Today's date is " + new Date().toLocaleDateString());
    } else if (message.includes("calculator")) {
        window.open("https://www.google.com/search?q=calculator", "_blank");
        speak("Opening Calculator...");
    } 
    // Open Gallery
    else if (message.includes("open gallery")) {
        window.open("file:///C:/Users/Public/Pictures", "_blank");
        speak("Opening Gallery...");
    } 
    // Open Music (YouTube Music)
    else if (message.includes("open music")) {
        window.open("https://music.youtube.com/", "_blank");
        speak("Opening Music...");
    } 
    // Play Song
    else if (message.includes("play a song")) {
        playSong();
    } 
    // Stop Song
    else if (message.includes("stop song")) {
        stopSong();
    } 
    // Open Camera
    else if (message.includes("open camera")) {
        openCamera();
    } 
    // Close Camera
    else if (message.includes("close camera")) {
        closeCamera();
    } 
    else {
        window.open(`https://www.google.com/search?q=${message.replace(/ /g, "+")}`, "_blank");
        speak("I found some information about " + message + " on Google.");
    }
}

// Function to Open Camera and Display it
function openCamera() {
    let videoElement = document.getElementById("cameraFeed");

    if (!videoElement) {
        videoElement = document.createElement("video");
        videoElement.id = "cameraFeed";
        videoElement.autoplay = true;
        videoElement.style.width = "100%";
        videoElement.style.maxWidth = "500px";
        videoElement.style.border = "3px solid #00bcd4";
        videoElement.style.borderRadius = "10px";
        videoElement.style.marginTop = "20px";
        videoElement.style.display = "block";
        document.body.appendChild(videoElement);
    }

    if (navigator.mediaDevices?.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                videoElement.srcObject = stream;
                cameraStream = stream;
                speak("Camera is now open.");
            })
            .catch(() => {
                speak("Sorry, I couldn't access the camera.");
            });
    } else {
        speak("Camera is not supported in this browser.");
    }
}

// Function to Stop Camera and Remove Video Element
function closeCamera() {
    let videoElement = document.getElementById("cameraFeed");

    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }

    if (videoElement) {
        videoElement.remove();
        speak("Camera is now closed.");
    } else {
        speak("Camera is already closed.");
    }
}

// Function to Play a Song
function playSong() {
    if (!audio) {
        audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
        audio.play();
        speak("Playing a song for you.");
    } else {
        speak("A song is already playing.");
    }
}

// Function to Stop the Song
function stopSong() {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
        speak("Stopping the song.");
        audio = null;
    } else {
        speak("No song is currently playing.");
    }
}
