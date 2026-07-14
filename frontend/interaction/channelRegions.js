import { timelineState } from "/static/state/timelineState.js";

export function isInChannelHeader(canvas, clientY) {
    const rect = canvas.getBoundingClientRect();

    const localY = clientY - rect.top;

    return(localY < rect.height * timelineState.channelHeaderHeightRatio)
}