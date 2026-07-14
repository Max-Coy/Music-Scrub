from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from audio.load import load_audio
from audio.waveform import generate_waveform_peaks



app = FastAPI()

app.mount("/static", StaticFiles(directory="frontend"), name="static")
app.mount("/temp", StaticFiles(directory="temp"), name="temp");

@app.get("/")
async def index():
    return FileResponse("frontend/index.html")

@app.get("/video")
async def video():
    return FileResponse("temp/output_video.mp4")


VIDEO_AUDIO_PATH = "temp/video_audio.wav"
SONG_AUDIO_PATH = "temp/song_audio.wav"

video_audio, video_sr = load_audio(VIDEO_AUDIO_PATH)
song_audio, song_sr = load_audio(SONG_AUDIO_PATH)

@app.get("/waveforms")
async def waveforms(bins_per_second: int = 100):

    video_peaks = generate_waveform_peaks(video_audio, video_sr, bins_per_second)
    song_peaks = generate_waveform_peaks(song_audio, song_sr, bins_per_second)

    return {
        "video": {
            "peaks": video_peaks,
            "duration": len(video_audio) / video_sr
        },
        "song": {
            "peaks": song_peaks,
            "duration": len(song_audio) / song_sr
        }
    }