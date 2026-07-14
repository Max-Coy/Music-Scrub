import soundfile as sf
import numpy as np

def load_audio(path: str):
    """
    load audio as a float32 numpy array

    Returns:
        audio: np.ndarray of shape (samples, channels)
        sample_rate: int
    """

    audio, sample_rate = sf.read(path, dtype='float32')

    if audio.ndim == 1:
        audio = np.expand_dims(audio, axis=1)
    
    return audio, sample_rate