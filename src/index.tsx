import React, {
  createContext,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useState,
} from "react";

export type VideoContextValue = {
  now: number;
  duration: number;
  paused: boolean;
  muted: boolean;
  volume: number;

  play: () => void;
  pause: () => void;
  mute: (status: boolean) => void;
  setVolume: (value: number) => void;
};

export const VideoContext = createContext<VideoContextValue | null>(null);

export interface VideoProviderProps {
  element: RefObject<HTMLVideoElement>;
  children: ReactNode;
}

export const VideoProvider = (props: VideoProviderProps) => {
  const { element, children } = props;

  const [paused, setPaused] = useState(true);
  const [muted, mute] = useState(false);
  const [volume, setVolume] = useState(1);
  const [now, setNow] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (element.current === null) return;

    element.current.muted = muted;
    element.current.volume = volume;
  }, [element, muted, volume]);

  useEffect(() => {
    const current = element.current;
    if (current === null) return;

    current.onplay = () => setPaused(false);
    current.onpause = () => setPaused(true);
    current.onvolumechange = () => setVolume(current.volume);
    current.ontimeupdate = () => setNow(current.currentTime);
    current.ondurationchange = () => setDuration(current.duration);
  }, [element, paused]);

  useEffect(() => {
    if (element.current === null) return;

    element.current.muted = muted;
  }, [element, muted]);

  const play = useCallback(() => element.current?.play(), [element]);
  const pause = useCallback(() => element.current?.pause(), [element]);

  return (
    <VideoContext.Provider
      value={{
        now,
        duration,
        muted,
        paused,
        volume,
        play,
        pause,
        mute,
        setVolume,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
