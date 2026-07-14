from pathlib import Path
import subprocess

def mux_audio_video(video_path: str, audio_path: str, output_path: str):
    """
    Combine video stream with audio
    """
    command = [
        "ffmpeg",

        # overwrite existing file
        "-y",

        # suppress console spam
        "-loglevel", "error",

        # input video
        "-i", str(video_path),

        # input processed audio
        "-i", str(audio_path),

        # copy video stream directly
        "-c:v", "copy",

        # encode audio as AAC
        "-c:a", "aac",

        # use processed audio
        "-map", "0:v:0",
        "-map", "1:a:0",

        str(output_path)
    ]

    subprocess.run(
        command,
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )