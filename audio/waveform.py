import numpy as np

def generate_waveform_peaks(audio, audio_samplerate, bins_per_second = 100):
    """
    Convert audio into waveform peak bins for webpage rendering
    """
    num_bins = int(len(audio)/ audio_samplerate * bins_per_second)
    # Convert stereo to mono
    if audio.ndim > 1:
        audio = audio.mean(axis = 1)

    samples_per_bin = max(1, len(audio) // num_bins)

    peaks = []

    for i in range(0, len(audio), samples_per_bin):
        chunk = audio[i: i+samples_per_bin]

        if len(chunk) == 0:
            continue

        peak = np.abs(chunk).max()

        peaks.append(float(peak))

    return peaks