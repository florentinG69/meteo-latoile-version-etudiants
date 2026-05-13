//je dois me localiser : 


let latitude = 42.42756
let longitude = 4.4165
/*navigator.geolocation.getCurrentPosition((coord) =>{
    console.log(coord)
    let latitude = coord.coords.latitude
    let longitude = coord.coords.longitude
}) */

console.log(latitude, longitude)

let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&current=temperature_2m,weather_code`

// le parametre url est l'adresse de l'api , fournie dans la documentation de l'api
// le parametre options est facultatif
fetch(url)
    .then(rep => {
        // pour info mais ce n'est pas important : l'api répond un objet RESPONSE et javascript le transforme en un format d'objet lisible et exploitable, celui que l'on connait "clé" : "valeur"
        return rep.json()
    })
    .then(data => {
        // ici j'ai access a la donnée envoyée par l'api 
        // on peut deja l'afficher en console pour regarder cet objet !
        console.log(data)
        //afficher le temps du jour
        afficheTempsDuJour(data.current.weather_code, data.current.temperature_2m)
        //afficher l'arriere plan 
        arrierePlanBody(data.current.weather_code)
        //afficher le temps des jours suivant
        afficheLesAutreJours(data.daily)
    })

//role: affiche le temps et la temperature du jour 
//dans la div qui a la classe CCS curent:
//parametre : code et temperature
//return : rien

function afficheTempsDuJour(code, temperature) {
    document.querySelector(".current").innerHTML = `
     <div class="picto-weather picto-${transformerCodeEnMot(code)}"></div>
     <p class="tmax">${temperature}°C</p>
     
    `

    console.log(temperature)
}

//Role: transformer le code recu de l'api en un mot
//paramtre: le code
//return : le mot

function transformerCodeEnMot(code) {

    if (code == 0) {
        // clear sky
        return "sun"
    } else if (code >= 1 && code < 45) {
        // partialy cloudy
        return "suncloud"
    } else if (code >= 45 && code < 61) {
        // foggy & cloudy
        return "cloud"
    } else if ((code >= 61 && code < 71) || (code >= 80 && code < 85)) {
        // Rainy
        return "rain"
    } else if ((code >= 71 && code < 77) || (code >= 85 && code < 95)) {
        // snow
        return "snow"
    } else if (code > 95) {
        // thunder
        return "thunder"
    } else {
        return "coucou"

    }
}

//role: donnner au body la bonne classe css pour afficher l'arriere plan
//parametre: le code
//retour : rien

function arrierePlanBody(code){
    let nomDeClasse = "bg-weather-"+transformerCodeEnMot(code)
    document.querySelector("body").classList.add(nomDeClasse)

}

//role : construire des petite cartes pour le temps des jours suivant et qui les affichera dans le document, dans la div qui a la classe carousel-daily-container
//parametre: meteoDesJour, un objet
//retour : rien

function afficheLesAutreJours(meteoDesJours){
    let template = ""
    for(let i=1; i<7;i++){

        //je fabrque le picto
        let picto = transformerCodeEnMot(meteoDesJours.weather_code[i])
        //j'utilise i pour me ballader dans les tableaux
        template+= ` <div class="dayly-weather">
                    <h4>${meteoDesJours.time[i]}</h4>
                    <div class="minipicto minipicto-${picto}"></div>
                    <h3 class="tmax">${meteoDesJours.temperature_2m_max[i]}°C</h3>
                    <h3 class="tmin">${meteoDesJours.temperature_2m_min[i]}°C</h3>  
                </div>`

    }

    document.querySelector(".carousel-daily-container").innerHTML = template
}