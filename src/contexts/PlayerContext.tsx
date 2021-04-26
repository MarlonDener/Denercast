import {createContext} from 'react'

type Episode = {
    title: string,
    members: string,
    thumbnail: string,
    duration: number,
    url: string
};

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    play: (episode: Episode) => void;
    togglePlay: () => void
    setPlayingSate: (state: boolean) => void
    playList: (list: Episode[], index: number) => void
    playNext:() => void
    playPrevious:() => void
    hasNext: boolean;
    hasPrevius: boolean;
    toggleLoop:() => void
    isLooping: boolean
    isShuffling: boolean
    toggleShuffle:() => void
    clearPlayerState:() => void
};

export const PlayerContext = createContext({} as PlayerContextData);

