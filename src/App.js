import React, { useState, useEffect } from 'react';
import './App.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function App() {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [emotion, setEmotion] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  //audio
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  //status
  const [statusmsg, setStatusmsg] = useState('all good so far...');

  const [songData, setSongData] = useState({
    title: 'On and On',
    artist: 'feat. Daniel Levi',
    image: './music/channels4_profile (5).jpg',
    audio: './music/On-and-On(PaglaSongs).mp3',
  });

  let recognition = new SpeechRecognition();

  const toggleListening = () => {
    if (recognition) {
      if (!listening) {

        if (SpeechRecognition) {
          console.log("started")
          recognition = new SpeechRecognition();
          recognition.lang = 'en-US';
          recognition.continous=true
          
          recognition.start();

          recognition.onresult = function(event) {
            const finalTranscript = event.results[0][0].transcript;
            setTranscript(finalTranscript);
            console.log("transcript done")
            recognition.stop();
            setListening(false);
            recognizeEmotion(finalTranscript);
          };
        }

        
        setListening(true);
      } else {
        recognition.stop();
        setListening(false);
      }
    } else {
      console.error('Recognition object is not initialized.');
    }
  };

  // EMOTION RECOGNITION
  const recognizeEmotion = async (text) => {
    const MAX_RETRIES = 3; // Maximum retries before throwing an error
    let attempts = 0;
  
    while (attempts <= MAX_RETRIES) {
      try {
        // Increment attempt count
        attempts++;
  
        // Make the API call
        const response = await fetch(
          "https://api-inference.huggingface.co/models/mrm8488/t5-base-finetuned-emotion",
          {
            headers: {
              Authorization: "Bearer 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",
            },
            method: "POST",
            body: JSON.stringify({ inputs: text }),
          }
        );
  
        // Check if the response is successful
        if (response.ok) {
          const result = await response.json();
          console.log(result[0].generated_text);
  
          // Update state and exit the loop
          setEmotion(JSON.stringify(result[0].generated_text));
          setSongData(getRandomSongDataForEmotion(result[0].generated_text));
          return; // Exit the function successfully

        } else if (response.status === 503 && attempts < MAX_RETRIES) {
          // Log the retry and wait before retrying
          setStatusmsg(`Attempt ${attempts} failed (503). Retrying...`);
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
        } else {
          // If not a 503 or max retries exceeded, throw error
          setStatusmsg(`API error: ${response.statusText} Try again manually`);
        }
      } catch (error) {
        if (attempts > MAX_RETRIES) {
          console.error("Error in emotion recognition after retries:", error);
          setStatusmsg("Error in emotion recognition after retries, So retry manually again.") // Throw error after all retries
        }
      }
    }
  };
  

  const playSong = () => {
    const audio = document.getElementById("audio3");
    audio.play();
    setIsPlaying(true);
  };

  const pauseSong = () => {
    const audio = document.getElementById("audio3");
    audio.pause()
    setIsPlaying(false);
  };

  const getRandomSongDataForEmotion = (emotion) => {
    const songs = {
      joy: [
        {
          title: 'Chitti',
          artist: 'Jathi ratnalu',
          image: './music/joy/download.jpg',
          audio: './music/joy/Chitti - SenSongsMp3.Com.mp3',
        },
        {
          title: 'Vaaru Veeru antha chusthu unna',
          artist: 'Devadas',
          image: './music/joy/download.jpeg',
          audio: './music/joy/[iSongs.info] 01 - Vaaru Veeru.mp3',
        },
      ],
      love: [
        {
          title: 'Poolane Kunukeyamantaa',
          artist: 'Shreya Goshal, Haricharan',
          image: './music/love/maxresdefault.jpg',
          audio: './music/love/[iSongs.info] 04 - Poolane Kunukeyamantaa.mp3',
        },
        {
          title: 'Ninnu chuse anandamlo',
          artist : 'Sid sriram',
          image: './music/love/size_m_1590418733.webp',
          audio: './music/love/[iSongs.info] 03 - Ninnu Chuse Anandamlo.mp3'
        }
      ],
      fear: [
        {
          title: 'Whatever It Takes',
          artist: 'Imagine Dragons',
          image: './music/fear/download (1).jpeg',
          audio: './music/fear/Whatever It Takes - Imagine Dragons.m4a'
        },
        {
          title: 'Chal chalo chalo',
          artist: 'son of satyamurthy',
          image: './music/fear/download.jpg',
          audio: './music/fear/[iSongs.info] 06 - Chal Chalo Chalo.mp3'
        }
      ],
      surprise: [
        {
          title: 'Jare Jare',
          artist: 'Majnu',
          image: './music/surprise/dc-Cover-n2bklorpfpead0vjljg36efd07-20160923202115.Medi.jpeg',
          audio: './music/surprise/[iSongs.info] 04 - Jare Jare.mp3'
        },
        {
          title: 'Whatcha Say',
          artist: 'Imogen Heap, Jason Derulo',
          image: './music/surprise/download.jpg',
          audio: './music/surprise/Whatcha Say - Jason Derulo.m4a'
        }
      ],
      sadness : [
        {
          title: 'IF',
          artist:'KLANG',
          image: './music/sadness/download.jpg',
          audio: './music/sadness/IF - KLANG.m4a'
        },
        {
          title: 'Aakasham nee hadhura',
          artist:'Aakasham nee hadhura',
          image: './music/sadness/image.png',
          audio: './music/sadness/[iSongs.info] 05 - Aakaasam Nee Haddhu Ra.mp3'
        }
      ],
      anger: [
        {
        title: 'Roar of the Revengers',
        artist: 'Anirudh Ravichander',
        image: './music/anger/Gang-Leader-Telugu-2019.jpg',
        audio: './music/anger/[iSongs.info] 01 - Roar of the Revengers.mp3'
        },
        {
          title: 'Love The Way You Lie',
          artist: 'Rihanna, Eminem',
          image: './music/anger/download.jpg',
          audio: './music/anger/Love The Way You Lie - Eminem, Rihanna.m4a'
        }
      ]
      // Add other emotions and their corresponding songs similarly
    };

    const randomIndex = Math.floor(Math.random() * songs[emotion].length);
    return songs[emotion][randomIndex];
  };

  //inline styling
  const buttonStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: listening? '#b30000' : '#007bff', // red: '#007bff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
    color: '#EAEAEA',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    //fontFamily: 'Indie Flower, cursive',
    fontFamily: 'Comic Sans MS',
  };

  const suggestionButtonStyle = {
    marginTop: '10px', marginRight: '18px',
    padding: '10px 20px',
    fontSize: '15px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
    color: '#CCCCCC', // Dark gray text color
    fontFamily: 'Walter Turncoat, sans-serif', // Font family
    border: 'none',
    borderRadius: '35px',
    cursor: 'pointer',
    background: '#333333', // Turquoise blue color
};
  
  const suggestionTexts = [
    "I'm feeling happy",
    "Feeling sad today",
    "Surprised!",
    "In a loving mood",
    "Feeling anxious",
    "what the hell is wrong with you today ",
  ];

  const setTranscriptFromSuggestion = (text) => {
    setTranscript(text);
    recognizeEmotion(text);
  };

  useEffect(() => {
    if (emotion) {
      playSong();
    }
  }, [emotion]);

  // Update audio current time
  const handleAudioTimeUpdate = (e) => {
    const audio = e.target;
    setAudioCurrentTime(audio.currentTime);
  };

  // Seek to a specific position in the song
  const seekTo = (time) => {
    const audio = document.getElementById("audio3");
    audio.currentTime = time;
  };

  // Calculate progress percentage
  const progress = (audioCurrentTime / (audioDuration ||1) ) * 100; //ensure a/b is not 0

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };
  
  
  return (
    <div className="voicecontainer">
      <h1>Mood-Driven Melodies</h1>
      <div className="suggestion-buttons">
        {suggestionTexts.map((text, index) => (
          <button key={index} style={suggestionButtonStyle} onClick={() => setTranscriptFromSuggestion(text)}>
            {text}
          </button>
        ))}
      </div>
      <div className="transcription">{transcript}</div>
      <button 
      style={buttonStyle}
      onClick={toggleListening}>
        {listening ? 'Listening...' : 'Start Listening'}
      </button>
      <h3 className="emotion">Detected Emotion: {emotion}</h3>
      <p> Status: {statusmsg}</p>

       {/* SONG WIDGET */}
       {emotion && (
         <div className="song-widget">
          <div className="song-info">
            <img src={songData.image} alt="Album Artwork" />
            <div>
              <h2>{songData.title}</h2>
              <p>{songData.artist}</p>
            </div>
          </div>
          <audio id="audio3" src={songData.audio} type="audio/mpeg" preload="none" onLoadedMetadata={(e) => setAudioDuration(e.target.duration)} onTimeUpdate={handleAudioTimeUpdate}></audio>

          {/* progress bar */}
          <div className="progress-bar">
            <progress value={progress} max="100" onClick={(e) => seekTo((e.nativeEvent.offsetX / e.target.offsetWidth) * audioDuration)}></progress>

          {/* Time Indicators */}
          <div style={{ display: 'flex', fontSize: '0.9rem', color: '#fff', marginTop: '0.3rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#fff', marginLeft: '9rem' }}>{formatTime(audioCurrentTime)}</span>
            <span style={{ fontSize: '0.9rem', color: '#fff',marginLeft: '9rem' }}>{formatTime(audioDuration)}</span>
          </div>

          </div>



          <div className="controls">
            {/* Play/pause button */}
            <button
              className="playbutton"
              onClick={isPlaying ? pauseSong : playSong}
            >
              {isPlaying ? (
                /* Pause icon */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="27"
                  height="27"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                /* Play icon */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="27"
                  height="27"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>
          
        </div>
       )}
    </div>
  );
}

export default App;