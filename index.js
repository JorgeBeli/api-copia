const home = document.querySelector('h1')
const body = document.querySelector('body')
const defaultPage = document.querySelector('#default')
const contenedor = document.querySelector('.character__wraper')
const personaje = document.querySelector('.character__info')
const actualPage = document.querySelector('.characters__page')
const previousPage = document.querySelector('#previous__page')
const previousPageStatus = document.querySelector('#previous__page__status')
const currentPage = document.querySelector('#current__page')
const nextPage = document.querySelector('#next__page')
const nextPageStatus = document.querySelector('#next__page__status')
const botones = document.querySelector('.buttons')
const contenedorStatus = document.querySelector('.card__info--left__status')
const estado = document.querySelector('#status')
const dropdownButton = document.querySelector('.dropdown__button')
const dropdown = document.querySelector('.dropdown')
const optionsDropdown = document.querySelector('.options__wraper')
const lightThemeCheckbox = document.querySelector('#lightThemeCheckbox')

const checkLightTheme = () =>{
    if(getLocalStorage('lightTheme') === true){
        cardLightMode()
    }else if(getLocalStorage('lightTheme') !== true){
        cardDefault()
    }
}

const cardLightMode = () =>{
    const card = document.getElementsByClassName('personaje')
    for(element of card){
        element.classList.add('lightThemePersonaje')
    }
}

const cardDefault = () =>{
    const card = document.getElementsByClassName('personaje')
    for(element of card){
        element.classList.remove('lightThemePersonaje')
    }
}

const activeLightMode = () =>{
    cardLightMode()
    body.style.backgroundColor = '#F7ECDE'
    actualPage.style.color = '#505050'
}

const desactiveLightMode = () =>{
    cardDefault()
    body.style.backgroundColor = '#202020'
    actualPage.style.color = '#ece8e7'
}

const lightTheme = () =>{
    document.addEventListener('DOMContentLoaded', () =>{
        lightThemeCheckbox.addEventListener('click', () =>{
            setLocalStorage('lightTheme', lightThemeCheckbox.checked)
            if(lightThemeCheckbox.checked === true){
                activeLightMode()
            }else if(lightThemeCheckbox.checked !== true){
                desactiveLightMode()
            }
        })
    })
}

const setLocalStorage = (key, value) =>{
    const json = JSON.stringify(value)
    const setJSON = localStorage.setItem(key,json)
}

const getLocalStorage = (key) =>{
    const data = localStorage.getItem(key)
    const parseData = JSON.parse(data)
    return parseData
}

const paginaActual = (pagina) =>{
    currentPage.innerHTML = pagina
}

let stat = ''
const checkStat = () =>{
    if(stat.length === 0){
        fetch('https://rickandmortyapi.com/api/character/')
        .then(respuesta => respuesta.json())
        .then(data => {
            contenedor.innerHTML = subirAHTML(data.results)
            agregarEventoDropdown()
            nextPage.addEventListener('click', async() =>{
                if(data.info.next === null){
                    nextPage.disabled = true
                    nextPage.style.cursor = 'not-allowed'
                    nextPage.style.color = '#303030'
                }else if(data.info.next !== null){
                    respuesta = await fetch(data.info.next)
                    data = await respuesta.json()
                    contenedor.innerHTML = subirAHTML(data.results)
                    agregarEventoDropdown()
                    previousPage.disabled = false
                    previousPage.style.cursor = 'pointer'
                    previousPage.style.color = '#fff'
                }
            })
            previousPage.addEventListener('click', async() =>{
                if(data.info.prev === null){
                    previousPage.disabled = true
                    previousPage.style.cursor = 'not-allowed'
                    previousPage.style.color = '#303030'
                }else if(data.info.next !== null){
                    respuesta = await fetch(data.info.prev)
                    data = await respuesta.json()
                    contenedor.innerHTML = subirAHTML(data.results)
                    agregarEventoDropdown()
                    nextPage.disabled = false
                    nextPage.style.cursor = 'pointer'
                    nextPage.style.color = '#fff'
                }
            })
        })
        .catch( () => console.log('error'))
    }else if(stat.length > 0){
        fetch(`https://rickandmortyapi.com/api/character/?status=${stat}`)
        .then(respuesta => respuesta.json())
        .then(data => {
            contenedor.innerHTML = subirAHTML(data.results)
            agregarEventoDropdown()
            nextPage.style.display = 'none'
            previousPage.style.display = 'none'
            nextPageStatus.style.display = 'flex'
            previousPageStatus.style.display = 'flex'
            nextPageStatus.addEventListener('click', async() =>{
                if(data.info.next === null){
                    nextPageStatus.disabled = true
                    nextPageStatus.style.cursor = 'not-allowed'
                    nextPageStatus.style.color = '#303030'
                }else if(data.info.next !== null){
                    respuesta = await fetch(data.info.next)
                    data = await respuesta.json()
                    contenedor.innerHTML = subirAHTML(data.results)
                    agregarEventoDropdown()
                    previousPageStatus.disabled = false
                    previousPageStatus.style.cursor = 'pointer'
                    previousPageStatus.style.color = '#fff'
                }
            })
            previousPageStatus.addEventListener('click', async() =>{
                if(data.info.prev === null){
                    previousPageStatus.disabled = true
                    previousPageStatus.style.cursor = 'not-allowed'
                    previousPageStatus.style.color = '#303030'
                }else if(data.info.prev !== null){
                    respuesta = await fetch(data.info.prev)
                    data = await respuesta.json()
                    contenedor.innerHTML = subirAHTML(data.results)
                    agregarEventoDropdown()
                    nextPageStatus.disabled = false
                    nextPageStatus.style.cursor = 'pointer'
                    nextPageStatus.style.color = '#fff'
                }
            })
        })
        .catch( () => console.log('error'))
    }
}
checkStat()
const agregarEventoDropdown = () =>{
    const opciones = document.querySelectorAll('.option')
    for(let i = 0; i < opciones.length; i++){
        opciones[i].addEventListener('click', () =>{
            let id = opciones[i].id
            if(id === 'aliveOption'){
                stat = 'alive'
                checkStat()
                actualPage.innerHTML = 'Characters Alive'
                dropdown.classList.remove('visible')
                setTimeout(checkLightTheme, 1)
            }else if(id === 'deadOption'){
                stat = 'dead'
                checkStat()
                actualPage.innerHTML = 'Characters Dead'
                dropdown.classList.remove('visible')
                setTimeout(checkLightTheme, 1)
            }else if(id === 'unknownOption'){
                stat = 'unknown'
                checkStat()
                actualPage.innerHTML = 'Characters Unknown'
                dropdown.classList.remove('visible')
                setTimeout(checkLightTheme, 1)
            }
        })
    }
}

defaultPage.addEventListener('click', () =>{
    window.location.reload()
})

actualPage.innerHTML = 'Characters'
window.scrollTo({top: 0, behavior: 'smooth'})
paginaActual()
setTimeout(checkLightTheme, 1)

const subirAHTML = (array) =>{
    const datos = array.reduce((acc,curr)=>{
        return acc + `
            <div class='personaje' id='${curr.id}'>
                <div class='personaje__img'>
                    <img src=${curr.image}>
                </div>
                <div class='personaje__info'>
                    <h2>${curr.name}</h2>
                    <p>${curr.status} - ${curr.species} - ${curr.gender}</p>
                </div>
                <div class='personaje__info--abajo'>
                    <p>Origin Location: </p>
                    <p>${curr.origin.name}</p>
                    <p>Last know location: </p>
                    <p>${curr.location.name}</p>
                </div>
            </div>
        `
    },'')
    return datos
}

const personajeInformacionAHTML = (data) =>{
    setTimeout(checkLightTheme, 1)
    return `
        <article class='card__wraper'>
            <div class='card__info--left__last__location'>
                <p>Last know location:</p>
                <p>${data.location.name}</p>
            </div>
            <div class='card__info--left__created'>
                <p>Register created: </p>
                <p>${data.created}</p>
                <p>Number of times seen:</p>
                <p>${data.episode.length}</p>
            </div>
            <div class='card__info--left__status'>
                <p id='status'>${data.status}</p>
            </div>
            <div class='card__info--img'>
                <img src='${data.image}' alt='${data.name}'>
            </div>
            <div class='card__info--right__name'>
                <h3>${data.name}</h3>
            </div>
            <div class='card__info--right__vitals'>
                <p>Status: </p>
                <p>${data.status}</p>
                <p>Species: </p>
                <p>${data.species}</p>
            </div>
            <div class='card__info--right__location'>
                <p>Gender: </p>
                <p>${data.gender}</p>
                <p>Origin Location:</p>
                <p>${data.origin.name}</p>
            </div>
        </article>
    `
}

const infoPersonaje = async(id) =>{
    const respuesta = await fetch(`https://rickandmortyapi.com/api/character/${id}`)
    const data = await respuesta.json()
    personaje.innerHTML = personajeInformacionAHTML(data)
    enfocarPersonaje()
}

const agregarEventoPersonajes = () =>{
    const personajes = document.querySelectorAll('.personaje')
    for(let i=0;i < personajes.length ;i++){
        personajes[i].addEventListener('click', () => {
            const id = personajes[i].id
            infoPersonaje(id)
        })
    }
}

home.addEventListener('click', () => {
    contenedor.style.display = 'grid'
    personaje.style.display = 'none'
    botones.style.display = 'flex'
})

const enfocarPersonaje = () => {
    contenedor.style.display = 'none'
    personaje.style.display = 'flex'
    botones.style.display = 'none'
    vivoOMuerto()
}

const vivoOMuerto = () =>{
    const cargaron = setTimeout(()=>{
        const contenedorStatus = document.querySelector('.card__info--left__status')
        const estado = document.querySelector('#status')
        if(estado.innerHTML === 'Alive'){
            contenedorStatus.style.background = '#88ff00'
        }else if(estado.innerHTML === 'Dead'){
            contenedorStatus.style.background = '#cc0000'
        }else{
            contenedorStatus.style.background = '#808080'
        }
    })
    cargaron
}

dropdownButton.addEventListener('click', () =>{
    dropdown.classList.toggle('visible')
})

lightTheme()