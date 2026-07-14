import { timelineState } from "/static/state/timelineState.js";

const audioContext = new AudioContext();

let songBuffer = null;
let songSource = null;
let videoPlayerRef = null;

const songGain = audioContext.createGain();

songGain.connect(audioContext.destination);

export function initializeAudioEngine(videoPlayer) {
    videoPlayerRef = videoPlayer;
}

export async function loadSongAudio(url) {
    const response = await fetch(url);

    const arrayBuffer = await response.arrayBuffer();

    songBuffer = await audioContext.decodeAudioData(arrayBuffer);
}

function createSongSource() {
    if(songBuffer === null) return null;

    const source = audioContext.createBufferSource();

    source.buffer = songBuffer;

    source.connect(songGain);
    updateSoloState(videoPlayerRef);

    return source;
}

export async function playSong() {
    if(songBuffer === null) return;

    await audioContext.resume();

    stopSong();

    songSource = createSongSource();
    let offset;
    if(timelineState.soloChannel === "video"){
        offset = Math.max(0, Math.min(timelineState.currentTime, songBuffer.duration));
    }else if(timelineState.soloChannel === "song") {
        offset = Math.max(0, Math.min(timelineState.currentTime, songBuffer.duration)) - timelineState.songClipStartTime;
    }
    if(offset < 0) return;

    songSource.start(0, offset);
    timelineState.audioIsOn = true;
}

export function stopSong() {
    if(songSource !== null) {
        try {
            songSource.stop();
        } catch {}

        songSource.disconnect();

        songSource = null;
        timelineState.audioIsOn = false;
    }
}

export function updateSoloState(videoPlayer) {
    if(timelineState.soloChannel === "video") {
        videoPlayer.muted = false;
        songGain.gain.value = 0;
    } else if(timelineState.soloChannel === "song") {
        videoPlayer.muted = true;
        songGain.gain.value = 1;
    }
}