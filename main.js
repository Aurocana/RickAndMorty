// Variables
const pokemonContainer = $("#contenedor-personajes");
let pagina = 1;

// Funciones

function $(elemento) {
  return document.querySelector(elemento);
}

// ===============div modal cardOne
/* let pokemonCardModal=[
  id:  
 ]
 */
const $modal = $("#modal");
$;

async function obtenerDatos(pagina) {
  const url = `https://rickandmortyapi.com/api/character?page=${pagina}`;
  const respuesta = await fetch(url);
  const datos = await respuesta.json();
  console.log(datos);
  return datos;
}

function personajes(data) {
  for (let i = 0; i < data.length; i++) {
    const pokemon = data[i];
    const pokemonCard = `
        <div class="character-card" onclick="filtrarPersonaje(${pokemon.id})">
            <div class="personaje-card__img">
            <img src="${pokemon.image}" alt="${pokemon.name}" />
            </div>
            <div class="character-card__info">
            <h3 class="character-card__name"> name: ${pokemon.name}</h3>
            <p class="character-card_id"> ID:${pokemon.id}</p>
            <p class="character-card__species"> species:${pokemon.species}</p>
            <p clas ="character-card_gender"> gender: ${pokemon.gender}</p>
            <p class="character-card_status"> status: ${pokemon.status}</p>
            </div>
        </div>
        `;
    pokemonContainer.innerHTML += pokemonCard;
  }
}

async function filtrarPersonaje(id) {
  limpiarContenido();
  console.log(id);
  const personajesFiltrados = await filtrarPersonajes(id, "ID");
  personajes(personajesFiltrados);
}

function mostrarTodosCaracteres(pagina) {
  obtenerDatos(pagina).then((datos) => {
    personajes(datos.results);
  });
}

// Eventos

window.addEventListener("load", () => {
  mostrarTodosCaracteres();
});

$("#btnSiguiente").addEventListener("click", () => {
  pokemonContainer.innerHTML = "";
  pagina++;
  mostrarTodosCaracteres(pagina);
});

$("#btnAnterior").addEventListener("click", () => {
  pokemonContainer.innerHTML = "";
  pagina--;
  mostrarTodosCaracteres(pagina);
});

$("#btnPrimeraPagina").addEventListener("click", () => {
  limpiarContenido();
  pagina = 1;
  mostrarTodosCaracteres(pagina);
});

$("#btnUltimaPagina").addEventListener("click", () => {
  limpiarContenido();
  pagina = 42;
  mostrarTodosCaracteres(pagina);
});

$("#busqueda").addEventListener("keyup", (e) => {
  obtenerDatos(pagina).then((datos) => {
    const listaPersonajes = datos.results;
    const personajeFiltrado = listaPersonajes.filter((personaje) => {
      return personaje.name
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    pokemonContainer.innerHTML = "";
    personajes(personajeFiltrado);
  });
});

$("#filtroOrden").addEventListener("change", async (e) => {
  const valor = e.target.value;
  limpiarContenido();
  let personajeFiltrado = [];
  if (valor === "A/Z") {
    const datos = await obtenerDatos(pagina);
    const listaPersonajes = datos.results;
    personajeFiltrado = listaPersonajes.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
  }
  if (valor === "Z/A") {
    const datos = await obtenerDatos(pagina);
    const listaPersonajes = datos.results;
    personajeFiltrado = listaPersonajes.sort((a, b) => {
      if (a.name < b.name) {
        return 1;
      }
      if (a.name > b.name) {
        return -1;
      }
      return 0;
    });
  }
  personajes(personajeFiltrado);
});

$("#filtroEstado").addEventListener("change", async (e) => {
  const valor = e.target.value;
  limpiarContenido();
  if (valor === "all") {
    mostrarTodosCaracteres(pagina);
  } else {
    const personajesFiltrados = await filtrarPersonajes(valor, "status");
    personajes(personajesFiltrados);
  }
});

$("#filtroGenero").addEventListener("change", async (e) => {
  const valor = e.target.value;
  limpiarContenido();
  if (valor === "all") {
    mostrarTodosCaracteres(pagina);
  } else {
    const personajesFiltrados = await filtrarPersonajes(valor, "gender");
    personajes(personajesFiltrados);
  }
});

$("#filtroEspecie").addEventListener("change", async (e) => {
  const valor = e.target.value;
  limpiarContenido();
  if (valor === "all") {
    mostrarTodosCaracteres(pagina);
  } else {
    const personajesFiltrados = await filtrarPersonajes(valor, "species");
    personajes(personajesFiltrados);
  }
});

async function filtrarPersonajes(valor, filtro) {
  const datos = await obtenerDatos(pagina);
  const listaPersonajes = datos.results;
  if (filtro === "ID") {
    const personajeFiltrado = listaPersonajes.filter((personaje) => {
      return personaje.id == valor;
    });
    return personajeFiltrado;
  }
  const personajeFiltrado = listaPersonajes.filter((personaje) => {
    return personaje[filtro].toLowerCase() == valor.toLowerCase();
  });
  return personajeFiltrado;
}

function limpiarContenido() {
  pokemonContainer.innerHTML = "";
}
