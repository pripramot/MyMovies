import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Error from "next/error";

export default function index(props) {
  // const [isLoading, setIsLoading] = useState(true);
  // const [data, setData] = useState();
  if (props.errorCode) {
    return <Error statusCode={errorCode} />;
  }

  const router = useRouter();

  // console.log(props);

  // if (router.isFallback) {
  //   return <div>Loading...</div>;
  // }

  function renderYtsMovieDetail() {
    return (
      <a
        href={`https://www.youtube.com/embed/${props.data.ytxData.data.movies[0].yt_trailer_code}?rel=0&wmode=transparent&border=0&autoplay=1&iv_load_policy=3`}
      >
        Youtube
      </a>
    );
  }

  return (
    <>
      <div>
        xi par {props.data.tmdbData.original_title}
        {props.data.ytxData === null ? <></> : renderYtsMovieDetail()}
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const token = "82a18ed118951da924967971e5b70de4";

  const instance = axios.create({
    baseURL: `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.API_KEY}`,
    timeout: 7000, // in milliseconds
  });

  const res = await instance.get(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.API_KEY}`
  );

  const data = res.data;

  return {
    paths: data.results.map((d) => ({ params: { movieId: d.id.toString() } })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  // const instance = axios.create({
  //   `https://api.themoviedb.org/3/movie/${params.movieId}?api_key=82a18ed118951da924967971e5b70de4&language=en-US`,
  //   timeout: 2000, // in milliseconds
  // });

  const instance = axios.create({
    baseURL: `https://api.themoviedb.org/3/movie/${params.movieId}?api_key=${process.env.API_KEY}&language=en-US`,
    timeout: 7000, // in milliseconds
  });
  // try {
  const res = await instance.get(
    `https://api.themoviedb.org/3/movie/${params.movieId}?api_key=${process.env.API_KEY}&language=en-US`
  );

  const tmdbData = res.data;

  const imdb_code = tmdbData.imdb_id;

  // let errorCode;

  const errorCode = res.statusText === "OK" ? false : res.status;

  // console.log(imdb_code);

  const ytxRes = await axios.get(
    `https://yts.mx/api/v2/list_movies.json?query_term=${imdb_code}`
  );

  // errorCode = ytxRes.statusText === "OK" ? false : ytxRes.status;
  let ytxData = ytxRes.data;

  // console.log(ytxData);
  if (ytxData.status !== "ok" || ytxData.data.movie_count === 0) {
    ytxData = null;
  }

  // ytxData = ytxRes.data;

  return {
    props: { errorCode, data: { tmdbData, ytxData } },
  };
  // }

  // catch (err) {
  //   return { notFound: true };
  // }
}
