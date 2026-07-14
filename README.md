# Music Scrub

Music Scrub is an experimental audio processing application for removing known songs from video files.

The workflow is simple: a user imports a video along with the original audio track (MP3/WAV) of the song present in that video. The software aligns the reference track with the video's audio, inverts the reference signal, and attempts to cancel the music before exporting a new version of the video with the modified audio.

The project combines digital signal processing, browser-based timeline editing, and media processing into a lightweight editing workflow inspired by modern audio software.

**This project is still in progress**

## Current Features

### Interactive Timeline

* Dual-track waveform display

  * Video audio
  * Reference song
* Zoomable and scrollable timeline
* Playhead navigation using mouse or keyboard
* Optional timeline snapping
* Minimap overview for navigating long audio files
* Adjustable song offset for alignment

### Media Processing

* Audio extraction from video
* Waveform generation and visualization
* Phase inversion of reference audio
* Video remuxing with processed audio
* Browser frontend communicating with a Python backend

## Roadmap

### Interactive Editing

* Trim handles
* Gain controls
* Mute/solo controls
* Phase inversion toggle
* Loop playback
* A/B comparison
* Cached waveform generation
* Background processing

### Improved Audio Cancellation

* FFT-based alignment
* Spectral matching
* Drift and tempo correction
* Frequency-domain subtraction
* Adaptive EQ and gain matching
* Reverb and compression compensation

### DAW-like Editing

* Multi-track timeline
* Clip splitting
* Undo/redo
* Project save/load
* Real-time DSP preview
* GPU-accelerated waveform rendering

### Future Ideas

A future desktop version may be built using Tauri, with native file dialogs and performance-critical DSP components rewritten in Rust or C++. This is an exploratory goal rather than a committed milestone.

## Technologies

* Python
* JavaScript
* HTML/CSS
* FFmpeg
* NumPy
* Browser Audio APIs

## Project Structure

```text
backend/    FastAPI backend and processing pipeline
frontend/   Browser UI, timeline, rendering, and interaction
audio/      Audio loading, processing, waveform generation
cli/        Command-line interface and utilities
```

## Purpose

Music Scrub began as a personal project exploring digital signal processing and interactive media software. Beyond implementing audio cancellation techniques, the project serves as an opportunity to build a browser-based editing interface, experiment with waveform visualization, and gain experience designing applications similar to lightweight digital audio workstations.

## AI Assistance

This project was developed with assistance from GPT-5.5. The codebase is a combination of handwritten and AI-assisted code. AI was used as a development aid for implementation ideas, debugging, and refactoring, while the overall project design, architecture, and feature implementation were directed and integrated by the author.

## License

Released under the MIT License.
