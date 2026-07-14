import numpy as np
from scipy.signal import correlate

def to_mono(audio: np.ndarray):
    """
    Convert stero audio to mono by averaging Channels
    """

    if audio.ndim == 1:
        return audio
    
    return audio.mean(axis = 1)


def find_alignment(video_audio, song_audio):
    """
    Find approximate alignment between video audio and song audio

    Returns:
        "video_start": int
        "song_start": int
        "overlap_length": int
    """

    correlation = correlate(video_audio, song_audio, mode="full")

    best_index = np.abs(correlation).argmax()

    lag = best_index - (len(song_audio) - 1)

    if lag >= 0:
        video_start = lag
        song_start = 0
    else:
        video_start = 0
        song_start = -lag

    overlap_length = min(
        len(video_audio) - video_start,
        len(song_audio) - song_start
    )

    return {
        "video_start": video_start,
        "song_start": song_start,
        "overlap_length": overlap_length
    }


def subtract_aligned_audio(video_audio, song_audio, alignment, gain=1.0):
    """
    Subtract aligned song audio from video audio
    """

    result = np.copy(video_audio)
    
    video_start = alignment["video_start"]
    song_start = alignment["song_start"]
    overlap_length = alignment["overlap_length"]

    video_end = video_start + overlap_length
    song_end = song_start + overlap_length

    result[video_start:video_end] -= (song_audio[song_start:song_end] * gain)

    result = np.clip(result, -1.0, 1.0)

    return result
