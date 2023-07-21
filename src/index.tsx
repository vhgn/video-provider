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
  seek: (progress: number) => void;
  setVolume: (value: number) => void;
};

export const VideoContext = createContext<VideoContextValue | null>(null);

const useSaved = (name: string, init: string, remember: string[]) => {
  const [value, setStateValue] = useState(init);

  useEffect(() => {
    if (remember.indexOf(name) === -1) return;

    const localValue = localStorage.getItem(name);
    if (localValue) setStateValue(localValue);
  }, [name, init, setStateValue, remember]);

  const setValue = (value: string) => {
    setStateValue(value);
    localStorage.setItem(name, value);
  };

  return {
    value,
    setValue,
  };
};

export interface VideoProviderProps {
  element: RefObject<HTMLVideoElement>;
  remember: ("mute" | "volume")[];
  children: ReactNode;
}

export const VideoProvider = (props: VideoProviderProps) => {
  const { element, children, remember } = props;

  const [paused, setPaused] = useState(true);
  const savedMute = useSaved("mute", "false", remember);
  const savedVolume = useSaved("volume", "1", remember);

  const mute = (value: boolean) => savedMute.setValue(value.toString());
  const muted = savedMute.value === "true";

  const setVolume = useCallback(
    (value: number) => savedVolume.setValue(value.toString()),
    [savedVolume]
  );
  const volume = Number(savedVolume.value);

  const [now, setNow] = useState(0);
  const [duration, setDuration] = useState<null | number>(null);

  useEffect(() => {
    if (element.current === null) return;

    setDuration(element.current.duration);
  }, [element]);

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
  }, [element, paused, setVolume]);

  useEffect(() => {
    if (element.current === null) return;

    element.current.muted = muted;
  }, [element, muted]);

  const play = useCallback(() => element.current?.play(), [element]);
  const pause = useCallback(() => element.current?.pause(), [element]);
  const seek = useCallback(
    (progress: number) => {
      if (element.current) element.current.currentTime = progress;
    },
    [element]
  );

  const value =
    duration !== null
      ? {
          now,
          duration,
          muted,
          paused,
          volume,
          play,
          pause,
          mute,
          seek,
          setVolume,
        }
      : null;

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
};
