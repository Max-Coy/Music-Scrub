import soundfile as sf

def save_audio(path, audio, sample_rate):
    """
    Save float32 WAV audio
    """
    sf.write(
        path, 
        audio,
        sample_rate,
        subtype="FLOAT"
    )