const playerData = {
  songs: null,
  currentSong: null,
  songCurrentTime: 0,
};

async function fetchPlaylistJson() {
  const response = await fetch("/json/dax-playlist.json");
  playerData.songs = await response.json();  
}
fetchPlaylistJson();


const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const playingSong = document.getElementById("player-song-title");
const songArtist = document.getElementById("player-song-artist");
const playerSeekbar = document.getElementById("player-seekbar");
let mouseDownOnSeekbar = false;

const audio = new Audio();

const playSong = (id, start=true) => {
  const song = playerData.songs.find((song) => song.id === id);
  audio.src = song.src;
  audio.title = song.title;
  if (playerData.currentSong === null || start) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = playerData.songCurrentTime;
  }
  playerData.currentSong = song;
  playButton.classList.add("playing");  
  setPlayerDisplay();
  highlightCurrentSong();
  setPlayButtonAccessibleText();
  audio.play();
};

const pauseSong = () => {
  playerData.songCurrentTime = audio.currentTime;
  playButton.classList.remove("playing");
  audio.pause();
};

const getCurrentSongIndex = () => playerData.songs.indexOf(playerData.currentSong);

const getNextSong = () => playerData.songs[getCurrentSongIndex() + 1];

const getPreviousSong = () => playerData.songs[getCurrentSongIndex() - 1];

const playPreviousSong = () => {
  if (playerData.currentSong === null) return;
  const previousSong = getPreviousSong();
  if (previousSong) {
    playSong(previousSong.id);
  } else {
    playSong(playerData.songs[0].id);
  }
};

const playNextSong = () => {
  if (playerData.currentSong === null) {
    playSong(playerData.songs[0].id);
    return;
  }
  const nextSong = getNextSong();
  if (nextSong) {
    playSong(nextSong.id);
  } else {
    playerData.currentSong = null;
    playerData.songCurrentTime = 0;
    setPlayerDisplay();
    highlightCurrentSong();
    setPlayButtonAccessibleText();
    pauseSong();
  }
};

const setPlayerDisplay = () => {
  const currentTitle = playerData.currentSong?.title;
  const currentArtist = playerData.currentSong?.artist;

  playingSong.textContent = currentTitle ? currentTitle : "";
  songArtist.textContent = currentArtist ? currentArtist : "";
};

const setPlayButtonAccessibleText = () => {
  const song = playerData.currentSong;
  playButton.setAttribute("aria-label", playerData.currentSong ? `Play ${song.title}` : "Play");
};

const setSeekbarValues = () => {
  if(audio) {      
    playerSeekbar.setAttribute("max", Math.floor(audio.duration));
    console.log(playerSeekbar);
  }
}

const highlightCurrentSong = () => {
  const previousCurrentSong = document.querySelector('.playlist-song[aria-current="true"]');
  previousCurrentSong?.removeAttribute("aria-current");
  const songToHighlight = document.getElementById(
    `song-${playerData.currentSong?.id}`
  );
  
  songToHighlight?.setAttribute("aria-current", "true");
};


playButton.addEventListener("click", () => {
  if (playerData.currentSong === null) {
    playSong(playerData.songs[0].id);
  } else {
    playSong(playerData.currentSong.id, false);
  }
});

const songs = document.querySelectorAll(".playlist-song");

songs.forEach((song) => {
  const id = song.getAttribute("id").slice(5);
  const songBtn = song.querySelector("button");
  songBtn.addEventListener("click", () => {
    playSong(Number(id));
  });
});

pauseButton.addEventListener("click", pauseSong);

nextButton.addEventListener("click", playNextSong);

previousButton.addEventListener("click", playPreviousSong);

playerSeekbar.addEventListener("mousedown", () => {  
  mouseDownOnSeekbar = true;
  pauseSong();
});

playerSeekbar.addEventListener("mouseup", () => {  
  mouseDownOnSeekbar = false;
  const seekBarVal = playerSeekbar.value;
  audio.currentTime = seekBarVal;
  playerData.songCurrentTime = seekBarVal;
  audio.play();
});

audio.addEventListener("loadeddata", setSeekbarValues);

audio.addEventListener("timeupdate", () => {
  if(!mouseDownOnSeekbar)
    playerSeekbar.value = audio.currentTime;
});

audio.addEventListener("ended", playNextSong);