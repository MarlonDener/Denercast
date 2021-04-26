import { useRouter } from 'next/router'
import {GetStaticProps, GetStaticPaths} from 'next'
import {format, parseISO} from 'date-fns'
import { api } from '../../services/api';
import {ptBR} from 'date-fns/locale/pt-BR';
import {convertDurationToTimeString} from '../../utils/convertDurationToTimeString';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head'
import {useContext} from 'react';
import { PlayerContext } from '../../contexts/PlayerContext'

import styles from './episode.module.scss'


type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    duration: string;
    durationAsString: string;
    descriptions: string;
    url: string;
    publishedAt: string
};
type EpisodeProps = {
    episode: Episode;
}

export default function Episode( { episode }: EpisodeProps ){
    const { play } = useContext(PlayerContext)

    return(
        <div className={styles.episode}>
            <Head>
                    <title>{episode.title}</title>
            </Head>
              <div className={styles.thumbnailContainer}>
                  <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="voltar" />
                    </button>
                  </Link>
                    <Image width={700} height={160} src={episode.thumbnail} objectFit="cover" />

                    <button type="button" onClick={() => play(episode)}>
                            <img src="/play.svg" alt="Tocar episódio" />
                    </button> 
              </div>  

               <header>
                       <h1>{episode.title}</h1>
                       <span>{episode.members}</span>
                       <span>{episode.pusblishedAt}</span> 
                       <span>{episode.durationAsString}</span>
                </header> 

                <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.descriptions}} />

        </div>
    )
}
//toda rota que tem pagina estatica dinamica é necessário esse metodo
export const getStaticPaths: GetStaticPaths = async () => {
    return{
        paths: [
            { params: {slug: 'a-importancia-da-contribuicao-em-open-source'}}
        ],
        fallback: 'blocking'
    }
}
//fim do metodo

export const getStaticProps: GetStaticProps = async (ctx) =>{
    const { slug } = ctx.params;
    const {data} = await api.get(`/episodes/${slug}`)

    const episode = 
        {
            id: data.id,
            title: data.title,
            thumbnail: data.thumbnail,
            members: data.members,
            pusblishedAt: format(parseISO(data.published_at), 'd MMM yy', {locale: ptBR}),
            duration: Number(data.file.duration),
            durationAsString: convertDurationToTimeString(Number(data.file.duration)),
            descriptions: data.description,
            url: data.file.url,
          }
    

          return {
            props:{
                episode
            },
            revalidate: 60 * 60 * 8,
          }
}