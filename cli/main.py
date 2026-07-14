from pathlib import Path
from audio.extract import extract_audio
from audio.load import load_audio
from audio.utils import to_mono
from audio.utils import find_alignment
from audio.utils import subtract_aligned_audio
from audio.save import save_audio
from video.mux import mux_audio_video

VIDEO_PATH = "Samples/carpet_bagger.mp4"
SONG_PATH = "Samples/rushing_back.wav"

TEMP_VIDEO_AUDIO = "temp/video_audio.wav"
TEMP_SONG_AUDIO = "temp/song_audio.wav"

AUDIO_OUTPUT_PATH = "temp/result.wav"
FINAL_VIDEO_PATH = "temp/output_video.mp4"

def main():
    
    Path("temp").mkdir(exist_ok = True)

    print("Extracting video audio.....")
    extract_audio(VIDEO_PATH, TEMP_VIDEO_AUDIO)

    print("Converting reference song....")

    extract_audio(SONG_PATH, TEMP_SONG_AUDIO) #we are ensuring both audio tracks have the same samplerates

    print("Loading data into numpy....")

    video_audio, video_sr = load_audio(TEMP_VIDEO_AUDIO)
    song_audio, song_sr = load_audio(TEMP_SONG_AUDIO)

    print()
    print("Video Audio")
    print("\tshape:", video_audio.shape)
    print("\tsample rate:", video_sr)

    print()
    print("Song Audio")
    print("\tshape:", song_audio.shape)
    print("\tsample rate:", song_sr)


    video_mono = to_mono(video_audio)
    song_mono = to_mono(song_audio)

    print()
    print("Mono Conversion")
    print("\tvideo mono shape:", video_mono.shape)
    print("\tsong mono shape:", song_mono.shape)

    print()
    print("Sample Values:")
    print("\tvideo min/max:", video_mono.min(), video_mono.max())
    print("\tsong min/max:", song_mono.min(), song_mono.max())

    print()
    print("Finding best Alignment")
    alignment = find_alignment(video_mono, song_mono)

    print("Alignment:")
    print(alignment)

    print("Performing Subtraction...")

    result_audio = subtract_aligned_audio(
        video_audio,
        song_audio,
        alignment,
        gain = 1.0
    )


    print("Saving result....")
    save_audio(AUDIO_OUTPUT_PATH, result_audio, video_sr)

    print("Muxing final video...")
    mux_audio_video(VIDEO_PATH, AUDIO_OUTPUT_PATH, FINAL_VIDEO_PATH)

    print("Done.")
    print("Output: ", FINAL_VIDEO_PATH)


if __name__ == "__main__":
    main()