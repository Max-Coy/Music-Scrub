import { timelineState } from "/static/state/timelineState.js";
import { renderStaticWaveforms, renderDynamicOverlays } from "/static/render/waveformRenderer.js";
import { setupMouse } from "/static/interaction/mouse.js";
import { setupTransport } from "/static/playback/transport.js";
import { setupKeyboardShortcuts } from "/static/interaction/keyboard.js";
import { dom } from "/static/ui/dom.js";
import { renderMinimapStatic, renderMinimapOverlay } from "/static/render/minimapRenderer.js";
import { loadSongAudio, initializeAudioEngine } from "/static/audio/audioEngine.js";

async function loadWaveforms() {
    const response = await fetch(
    `/waveforms?bins_per_second=${
        timelineState.waveformBinsPerSecond
    }`
)

    const data = await response.json();

    timelineState.videoData = data.video;
    timelineState.songData = data.song;
    timelineState.projectDuration = 
        Math.max(timelineState.videoData.duration, timelineState.songData.duration);

    timelineState.duration = timelineState.videoData.duration; 

    resizeWaveforms();
    renderStaticWaveforms();
    renderMinimapStatic();
    render();
}

function resizeWaveforms() {
    const baseWidth = dom.videoWaveformStatic.parentElement.clientWidth;

    dom.videoWaveformStatic.style.width = `${baseWidth}px`;

    // const scale = timelineState.songData.duration / timelineState.videoData.duration;

    dom.songWaveformStatic.style.width = `${baseWidth}px`;
}


function render(options = {}) {

    if(timelineState.videoData === null || timelineState.songData === null) return;

    if(options.staticWaveforms) renderStaticWaveforms();

    renderDynamicOverlays();
    renderMinimapOverlay();

}

window.addEventListener("resize", () => {
    resizeWaveforms();
    renderStaticWaveforms();
    renderMinimapStatic();
    render();
})



loadWaveforms();
initializeAudioEngine(dom.videoPlayer);
await loadSongAudio("/temp/song_audio.wav");
setupMouse(dom.videoPlayer, render);
setupTransport(dom.videoPlayer, render);
setupKeyboardShortcuts(dom.videoPlayer, render);
// setupMinimapNavigation();
