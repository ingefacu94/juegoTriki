document.addEventListener('DOMContentLoaded', () => {
    const botonReiniciar = document.getElementById('restart-btn');

    //seleccionar del DOM todos los elementos con la etiqueta [data-cell]
    const celdas = document.querySelectorAll('[data-cell]'); 

    const botonIniciar = document.getElementById('start-game-btn');
    const jugador1Input = document.getElementById('player1');
    const jugador2Input = document.getElementById('player2');
    const contenedorJuego = document.querySelector('.game');
    const puntajeJugador1Ht = document.getElementById('puntaje-jugador-1');
    const puntajeJugador2Ht = document.getElementById('puntaje-jugador-2');
    const puntajeEmpateHt = document.getElementById('puntaje-empate');
    const nombreJugador1Ht = document.getElementById('nombre-jugador-1');
    const nombreJugador2Ht = document.getElementById('nombre-jugador-2');
    
    //Check box para validar si se guega contra la maquina
    var checkIa = document.getElementById('juego-maquina');
    //variable global para saber si el juego está activo
    var juegoActivo = true;
    var jugador1='';
    var jugador2='';
    jugadorActual='X'

    //array para almacenar puntaje
    var tableroPuntaje = []

    //Array para almacenar los juegos del tablero
    var tablero = ['', '', '', '', '', '', '', '', ''];

    //array con combinaciones posibles para ganar
    var combinacionesGanadoras =[
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    //

    //En caso de que haya ganador se busca dentro del array el indice del jugador que gano y se acumula el puntaje
    function registrarPuntaje(jugador, puntos){
        var indice = tableroPuntaje.findIndex(i=>i.jugador===jugador)
        if(indice!==-1){
            tableroPuntaje[indice].puntaje +=puntos
        }
        mostrarPuntaje(tableroPuntaje)
        
    }

    //Muestra en el HTML el puntaje que lleva cada jugador, de acuerdo a si es X, O o la maquina

    function mostrarPuntaje(array){
        puntajeJugador1Ht.innerHTML='';
        var puntajeX = array.find(i=>i.jugador==='X')
        puntajeJugador1Ht.textContent = puntajeX.puntaje

        puntajeJugador2Ht.innerHTML='';
        var puntajeO = array.find(i=>i.jugador==='O')
        puntajeJugador2Ht.textContent= puntajeO.puntaje

        puntajeEmpateHt.innerHTML = ''
        var puntajeEmpate = array.find(i=>i.jugador==='Empate')
        puntajeEmpateHt.textContent = puntajeEmpate.puntaje
    }
    
    //Boton Iniciar juego
    botonIniciar.addEventListener('click', (e)=>{
        jugador1=jugador1Input.value ;
        jugador2=jugador2Input.value || 'IA';
        // Se crea array de objetos con el simbolo del jugador, el nombre que ingresa en las cajas de textos y tambien se da empates
        tableroPuntaje=[
            {
                jugador: 'X',
                puntaje: 0,
                nombreJugador: jugador1
            },
        
            {
                jugador : 'O',
                puntaje:0,
                nombreJugador: jugador2
            },
        
            {
                jugador: 'Empate',
                puntaje:0
            }
        ]
        mostrarNombres()
        document.querySelector('.player-inputs').style.display = 'none';
        contenedorJuego.style.display = 'block';
    });

    function mostrarNombres(){
        //Se busca en el array de objetos el nombre que corresponde a cada simpolo para luego mostrarlo en el HTML 
        nombreJugador1Ht.innerHTML ='';
        var nombrejugadorX = tableroPuntaje.find(i=>i.jugador==='X')
        nombreJugador1Ht.textContent = nombrejugadorX.nombreJugador

        nombreJugador2Ht.innerHTML ='';
        var nombrejugadorO = tableroPuntaje.find(i=>i.jugador==='O')
        nombreJugador2Ht.textContent = nombrejugadorO.nombreJugador
    }

    //Boton reiniciar
    botonReiniciar.addEventListener('click', (e)=>{
        reiniciarJuego();
    });

    //Valida ganador, funciona haciendo un recorrido por el array de combinaciones posibles, luego compara cada item, con los valores de cada indice
    //del tablero, si coinciden retorna true y llama la función pintarGanadoras(combinaciones); para agregar una clase de css para pintar las celdas
    function validarGanador(jugador){
        var ganador = false
        combinacionesGanadoras.forEach(combinaciones =>{
            const combosGanadores = combinaciones.every(index=>tablero[index]===jugador);
            if(combosGanadores){
                pintarGanadoras(combinaciones);
                ganador=true;
            }
        })
        return ganador;
    }


    //Recorre las celdas y agrega la clase marcadas-ganadoras
    function pintarGanadoras(ganadoras){
        if(Array.isArray(ganadoras)){
            ganadoras.forEach(i=>{
                celdas[i].classList.add('marcadas-ganadoras')
            })
        }
        
    }


    //Insertar marca de jugadores
    function jugar(event){

        const celda = event.target
        const indiceCelda = Array.from(celdas).indexOf(celda);

        //Si no hay celdas disponibles y el juego no esta activo no hace nada
        if(tablero[indiceCelda]!=='' || juegoActivo===false){
            return 0
        }

        //llama funcion poner marca para , incluir la X o O
        ponerMarca(celda, indiceCelda);
        
        if(validarGanador(jugadorActual)){
            registrarPuntaje(jugadorActual,1)
            pintarGanadoras(jugadorActual)
            finalizarJuego(false)
            console.log('Ha ganado el jugador: ' + jugadorActual)
        }else if(comprobarEmpate()){
            finalizarJuego(true)
            registrarPuntaje('Empate',1)
        }else{
            cambiarJugador();
            //Este IF revisa si se marco la opción de jugar contra IA, de ser así llama la función juegoMaquina(true) qe genera un numero 
            //aleatorio, ese numero aleatorio se agrega como indice al tablero y a las celdas para que registre la jugada
            if(checkIa.checked){
                
                var juegoTurnoMaquina = juegoMaquina(true)
                var celdaIa = celdas[juegoTurnoMaquina];
                ponerMarca(celdaIa, juegoTurnoMaquina)
    
                if(validarGanador(jugadorActual)){
                    registrarPuntaje(jugadorActual,1)
                    finalizarJuego(false)
                    console.log('Ha ganado el jugador: ' + jugadorActual)
                }else if(comprobarEmpate()){
                    finalizarJuego(true)
                    registrarPuntaje('Empate',1)
                }else{
                    cambiarJugador();
                }   
            }
        }
    }

    function juegoMaquina(turno){
        //Genera un numero random de 0 - 9, si ya está ocupado se genera de nuevo hasta que de con una celda libre
        if(turno===true){
            
            var jugadaHecha = false
            do{
                var indiceJugadaIA = Math.floor(Math.random() * 10)
                if(tablero[indiceJugadaIA]===''){
                    jugadaHecha=true;
                    return indiceJugadaIA
                    break;
                }
            }while(jugadaHecha===false) 
        }
    }
    // Poner marca, de acuerdo al jugador actual 
    function ponerMarca(celda, indice){
        tablero[indice] = jugadorActual;
        celda.textContent = jugadorActual;
        celda.style.color = jugadorActual === 'X' ? '#f44336' : '#1cdd3c';

    }

    //Cambia de jugador
    function cambiarJugador(){
        if(jugadorActual==='X'){
            jugadorActual='O'
        }else{
            jugadorActual='X'
        }
    }

    function finalizarJuego(empate){
        juegoActivo=false;
        var ganador='';
        if (empate===true) {
            ganador='¡Empate!'    
            alert(ganador)
        } else {
            if(jugadorActual==='X'){
                ganador = jugador1
            }else{
                ganador = jugador2
            } 
            alert('El ganador es: '+ ganador)   
        }
    }

    function comprobarEmpate(){
        return tablero.every(item=>item!=='')
        
    }


    function reiniciarJuego(){

        tablero = ['', '', '', '', '', '', '', '', ''];
        celdas.forEach(celda=>{
             celda.textContent = '';
             celda.style.color = '#333';
             celda.classList.remove('marcadas-ganadoras');
             
        })
        
        juegoActivo=true
        jugadorActual='X'
    }

    //Función para recorrer celdas
    celdas.forEach(celda=>{
        celda.addEventListener('click', jugar);
    });


});