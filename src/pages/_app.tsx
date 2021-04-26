import '../styles/global.scss'
import {Header} from '../components/Header'
import styles from '../styles/app.module.scss'
import {Player} from '../components/player'
import { PlayerContext } from '../contexts/PlayerContext';
import {useState} from 'react'

type Episode = {
  title: string,
  members: string,
  thumbnail: string,
  duration: number,
  url: string
};


function MyApp({ Component, pageProps }) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
    

  const hasPrevius = currentEpisodeIndex > 0
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

  function play(episode){
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList(list: Episode[], index: number){
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay(){
    setIsPlaying(!isPlaying);
  }
  function toggleLoop(){
    setIsLooping(!isLooping);
  }
  function toggleShuffle(){
    setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean){
    setIsPlaying(state);
  }

  function clearPlayerState(){
    setEpisodeList([]);
      setCurrentEpisodeIndex(0)
  }

  function playNext(){
    if(isShuffling){
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    
    }else if (hasNext){
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
   }
  }
  function playPrevious(){
    if(hasPrevius){
    setCurrentEpisodeIndex(currentEpisodeIndex - 1);
  }
  }

  return (
  <PlayerContext.Provider value={{ episodeList,
   currentEpisodeIndex,
   play, 
   isPlaying,
   togglePlay,
   setPlayingState,
   playList,
   playNext,
   playPrevious,
   hasNext,
   hasPrevius,
   isLooping,
   toggleLoop,
   isShuffling,
   toggleShuffle,
   clearPlayerState
   }}> 
    <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>

        <Player/>
    </div>

  </PlayerContext.Provider>
  )
}

export default MyApp
