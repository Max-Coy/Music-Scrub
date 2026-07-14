from pathlib import Path
import subprocess

def extract_audio(video_path: str, output_path: str):
    """
    Extract audio from a video file and convert it to:
    - Stereo
    - 48 kHz
    - float PCM WAV 
    """

    video_path = Path(video_path)
    output_path = Path(output_path)

    command = [
        "ffmpeg",

        # overwrite output file if it already exists
        "-y",

        # only show actual errors
        # suppresses ffmpeg banner/progress spam
        "-loglevel", "error",

        # input file
        "-i", str(video_path),

        # disable video output
        # we only want audio
        "-vn",

        # force stereo output
        "-ac", "2",

        # resample to 48kHz
        "-ar", "48000",

        # encode as 32-bit floating point PCM
        "-c:a", "pcm_f32le",

        # output wav file path
        str(output_path)
    ]

    subprocess.run(
    command,
    check=True,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL
)