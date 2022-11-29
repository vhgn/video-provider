# Description

This is a provider, which listens to specific events of `<video>` element and updates corresponding states.
It helps you render your UI based on states and not worry about any triggering changes.

[![Edit video-provider-example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/video-provider-example-zu0hdd?fontsize=14&hidenavigation=1&theme=dark)

# Usage

```tsx
import { useContext, useRef } from "react";
import { VideoProvider, VideoContext } from "video-provider";

const Page = () => {
  // Using these states will rerender your component on change
  const {
    now,
    duration,
    paused,
    muted,
    volume,

    play,
    pause,
    mute,
    setVolume
  } = useContext(VideoContext);

  return (
    <div>
      <p>
        Time {now.toFixed()}:{duration.toFixed()}
      </p>
      <p>Player is {paused ? "paused" : "playing"}</p>
      <p>Sound is {muted ? "muted" : "not muted"}</p>
      <p>Volume is {volume * 100}%</p>

      <button onClick={paused ? play : pause}>
        {paused ? "Play" : "Pause"}
      </button>
      <button onClick={() => mute(!muted)}>{muted ? "Unmute" : "Mute"}</button>
      <input
        type="number"
        placeholder="Volume"
        onInput={(e) => {
          const newVolume = Number(e.currentTarget.value) / 100;

          if (newVolume > 1) return setVolume(1);
          if (newVolume < 0) return setVolume(0);
          setVolume(newVolume);
        }}
      />
    </div>
  );
};

export const App = () => {
  const ref = useRef(null);

  return (
    <div>
      <video
        controls
        ref={ref}
        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      />
      <VideoProvider element={ref}>
        <Page />
      </VideoProvider>
    </div>
  );
};
```
