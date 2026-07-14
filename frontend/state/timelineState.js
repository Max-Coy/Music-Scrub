export const timelineState = {
    videoData: null,
    songData: null,

    currentTime: 0,
    lastFrameTimeStamp: null,
    duration: 1,
    videoFPS: 30,
    waveformBinsPerSecond: 100,

    isScrubbing: false,
    wasPlayingBeforeDrag: false,
    previousMouseX: 0,
    rawScrubTime: 0,

    tickMode: "auto",
    fixedTickInterval: 1.0,
    majorTickCount: 10,
    minorTicksPerMajor: 4,

    animationFrameID: null,

    snappingEnabled: false,
    selectedChannel: "video",
    channels: [
        "video",
        "song"
    ],

    viewportStartTime: 0,
    viewportDuration: 40,
    projectDuration: 1,
    isPlaying: false,

    transportStartTime: 0,

    isDraggingViewport: false,
    viewportDragOffset: 0,
    viewportLastMouseY: 0,

    soloChannel: "song",

    channelHeaderHeightRatio: 0.15,

    songClipStartTime: 0,
    isDraggingClip: false,
    draggedClip: null,
    audioIsOn: false,
}