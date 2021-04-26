//SPA
/*  useEffect(() => {

  fetch("url").then(response => response.json()).then(data => console.log(data)) }. []) */
//SSR
//SSG
import {GetStaticProps} from 'next'
import Image from 'next/image';
import {format, parseISO} from 'date-fns'
import {Header} from '../components/Header';
import { api} from '../services/api';
import {ptBR} from 'date-fns/locale/pt-BR';
import {convertDurationToTimeString} from '../utils/convertDurationToTimeString';
import { useContext } from 'react';
import { PlayerContext } from '../contexts/PlayerContext';
import Head from 'next/head'


import Link from 'next/link'

import styles from './home.module.scss'

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: string;
  durationAsString: string;
  url: string;
  publishedAt: string
}

type HomeProps = {
  latestEpisodes: Array<Episode>;
  allEpisodes: Array<Episode>;

}

export default function Home({ latestEpisodes, allEpisodes}: HomeProps) {  

  const { playList } = useContext(PlayerContext)

  const episodeList = [...latestEpisodes, ...allEpisodes];

  return (
    <div className={styles.homePage}>
      <Head>
          <title>Home | DenerCast</title>
      </Head>
      <section className={styles.latestEpisodes}>
      <h2>Últimos episodios</h2>
      <ul>
          {latestEpisodes.map((episode, index) => {
            return(
              <li key={episode.id}>
                  <Image
                   width={192}
                   height={192} 
                   src={episode.thumbnail}
                   alt={episode.title}
                   objectFit="cover" 
                   />

                  <div className={styles.episodeDetails}>
                      <a href="">{episode.title}</a>
                      <p>{episode.members}</p>
                      <span>{episode.pusblishedAt}</span>
                      <span>{episode.durationAsString}</span>
                   </div>
                   <button type="button" onClick={() => playList(episodeList, index)}>

                        <img src="/play-green.svg" alt="Tocar episódio" />

                    </button>

              </li>
            )
          })}
      </ul>

      </section>

      <section className={styles.allEpisodes}>
            <h2>Todos episódios</h2>
            <table cellSpacing={0}>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Podcast</th>
                      <th>Integrantes</th>
                      <th>Data</th>
                      <th>Duração</th>
                    </tr>
                  </thead>
                  <tbody>

                          {allEpisodes.map((episode,index) => {
                            return(
                              <tr key={episode.id}>
                                <td  style={{width: 72}}>
                                  <Image width={120} height={120} src={episode.thumbnail} alt={episode.title} objectFit="cover"/>
                                </td>
                                <td>
                                  <Link href={`/episode/${episode.id}`}>
                                    <a >{episode.title}</a>
                                  </Link>
                                </td>
                                <td>
                                    {episode.members}
                                </td>
                                <td style={{width: 100}}>
                                    {episode.pusblishedAt}
                                </td>
                                
                                <td>
                                    {episode.durationAsString}
                                </td>
                                
                                <td>
                                    <button onClick={() => playList(episodeList, index + latestEpisodes.length)} type="button"><img src="/play-green.svg" alt="Tocar episódio" /></button>
                                </td>
                              </tr>
                            )
                          })}

                  </tbody>
            </table>
      </section>

    </div>
  )
}

export const getStaticProps : GetStaticProps = async () => {
  const {data} = await api.get("episodes",{
    params:{
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })
 // const data = await response.data

 const episodes = data.map(episode => {
   return {
     id: episode.id,
     title: episode.title,
     thumbnail: episode.thumbnail,
     members: episode.members,
     pusblishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
     duration: Number(episode.file.duration),
     durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
     url: episode.file.url,
   }
 })

 const latestEpisodes = episodes.slice(0, 2);
 const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props:{
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}
