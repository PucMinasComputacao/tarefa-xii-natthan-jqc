const API_KEY = "dd48c02c6572f22f45a1f5329955e9c9";

const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const movieList = document.getElementById("movie-list");
const message = document.getElementById("message");
const searchInput = document.getElementById("search");
const btnSearch = document.getElementById("btnSearch");

async function fetchMovies(query = "") {
  try {
    showMessage("Carregando filmes...");

    let url = "";

    if (query.trim() === "") {
      url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`;
    } else {
      url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=1`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Erro ao buscar dados da API.");
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    showMessage("Erro ao carregar os filmes. Verifique sua API Key ou conexão.");
    console.error(error);
    return [];
  }
}

function createMovieCard(movie) {
  const card = document.createElement("div");
  card.classList.add("movie-card");

  card.addEventListener("click", function () {
    window.location.href = `details.html?id=${movie.id}`;
  });

  const poster = document.createElement("img");

  if (movie.poster_path) {
    poster.src = `${IMAGE_BASE_URL}${movie.poster_path}`;
  } else {
    poster.src = "https://via.placeholder.com/500x750?text=Sem+Poster";
  }

  poster.alt = `Poster do filme ${movie.title}`;

  const title = document.createElement("h2");
  title.textContent = movie.title;

  const year = document.createElement("p");
  const releaseYear = movie.release_date
    ? movie.release_date.split("-")[0]
    : "Ano não informado";
  year.textContent = `Ano: ${releaseYear}`;

  const rating = document.createElement("p");
  rating.textContent = `Nota média: ${movie.vote_average.toFixed(1)}`;

  const overview = document.createElement("p");
  overview.classList.add("overview");

  if (movie.overview) {
    overview.textContent =
      movie.overview.length > 120
        ? movie.overview.substring(0, 120) + "..."
        : movie.overview;
  } else {
    overview.textContent = "Sinopse não disponível.";
  }

  card.appendChild(poster);
  card.appendChild(title);
  card.appendChild(year);
  card.appendChild(rating);
  card.appendChild(overview);

  return card;
}

function renderMovies(movies) {
  movieList.innerHTML = "";

  if (!movies || movies.length === 0) {
    showMessage("Nenhum filme encontrado.");
    return;
  }

  showMessage("");

  movies.forEach(function (movie) {
    const card = createMovieCard(movie);
    movieList.appendChild(card);
  });
}

function showMessage(text) {
  message.textContent = text;
}

async function searchMovies() {
  const query = searchInput.value;
  const movies = await fetchMovies(query);
  renderMovies(movies);
}

async function init() {
  const movies = await fetchMovies();
  renderMovies(movies);
}

btnSearch.addEventListener("click", searchMovies);

searchInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    searchMovies();
  }
});

init();