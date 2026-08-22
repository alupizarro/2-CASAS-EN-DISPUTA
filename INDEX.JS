const FILAS = 10;
const COLUMNAS = 10;
const CANTIDAD_CASAS = 5;
const MAX_TURNOS = 50;

// -------------------------
// JUGADORES
// -------------------------

const jugador1 = {
    nombre: "Jugador 1",
    fichas: [[0, 0]],
    casasConquistadas: 0,
    fallosConsecutivos: 0,
    nuevasFichas: []
};

const jugador2 = {
    nombre: "Jugador 2",
    fichas: [[9, 9]],
    casasConquistadas: 0,
    fallosConsecutivos: 0,
    nuevasFichas: []
};

// -------------------------
// TABLERO
// -------------------------

function crearTablero() {
    const tablero = [];

    for (let fila = 0; fila < FILAS; fila++) {
        const nuevaFila = [];

        for (let columna = 0; columna < COLUMNAS; columna++) {
            nuevaFila.push(".");
        }

        tablero.push(nuevaFila);
    }

    return tablero;
}

// -------------------------
// SEMILLA
// -------------------------

function crearGenerador(semilla) {
    let valor = semilla;

    return function () {
        valor = (valor * 9301 + 49297) % 233280;
        return valor / 233280;
    };
}

// -------------------------
// GENERAR CASAS
// -------------------------

function generarCasas(semilla) {
    const generador = crearGenerador(semilla);
    const casas = [];

    while (casas.length < CANTIDAD_CASAS) {
        const fila = Math.floor(generador() * FILAS);
        const columna = Math.floor(generador() * COLUMNAS);

        const posicionOcupadaPorJugador =
            (fila === 0 && columna === 0) ||
            (fila === 9 && columna === 9);

        const posicionRepetida = casas.some(
            casa =>
                casa[0] === fila &&
                casa[1] === columna
        );

        if (!posicionOcupadaPorJugador && !posicionRepetida) {
            casas.push([fila, columna]);
        }
    }

    return casas;
}

// -------------------------
// MOVIMIENTO TOROIDAL
// -------------------------

function calcularPosicion(posicion, direccion, cantidad) {
    let fila = posicion[0];
    let columna = posicion[1];

    if (direccion === "arriba") {
        fila = (fila - cantidad + FILAS) % FILAS;
    }

    if (direccion === "abajo") {
        fila = (fila + cantidad) % FILAS;
    }

    if (direccion === "izquierda") {
        columna = (columna - cantidad + COLUMNAS) % COLUMNAS;
    }

    if (direccion === "derecha") {
        columna = (columna + cantidad) % COLUMNAS;
    }

    return [fila, columna];
}

// -------------------------
// MOVIMIENTOS VÁLIDOS
// -------------------------

function calcularMovimientosValidos(posicion, cantidad, fichas) {
    const direcciones = [
        "arriba",
        "abajo",
        "izquierda",
        "derecha"
    ];

    const movimientos = [];

    for (const direccion of direcciones) {
        const nuevaPosicion =
            calcularPosicion(posicion, direccion, cantidad);

        const ocupada = fichas.some(
            ficha =>
                ficha[0] === nuevaPosicion[0] &&
                ficha[1] === nuevaPosicion[1]
        );

        if (!ocupada) {
            movimientos.push({
                direccion: direccion,
                posicion: nuevaPosicion
            });
        }
    }

    return movimientos;
}

// -------------------------
// ELEGIR MOVIMIENTO
// -------------------------

function elegirMovimiento(movimientos) {
    if (movimientos.length === 0) {
        return null;
    }

    return movimientos[0];
}

// -------------------------
// COMPROBAR CASA
// -------------------------

function buscarCasa(posicion, casas) {
    return casas.findIndex(
        casa =>
            casa[0] === posicion[0] &&
            casa[1] === posicion[1]
    );
}

// -------------------------
// MOSTRAR TABLERO
// -------------------------

function mostrarTablero(jugador1, jugador2, casas) {
    const tablero = crearTablero();

    for (const ficha of jugador1.fichas) {
        tablero[ficha[0]][ficha[1]] = "1";
    }

    for (const ficha of jugador2.fichas) {
        tablero[ficha[0]][ficha[1]] = "2";
    }

    for (const casa of casas) {
        tablero[casa[0]][casa[1]] = "C";
    }

    console.log("\nTABLERO:");

    for (const fila of tablero) {
        console.log(fila.join(" "));
    }
}

// -------------------------
// DADO
// -------------------------

function tirarDado(generador) {
    return Math.floor(generador() * 3) + 1;
}

// -------------------------
// UBICAR NUEVA FICHA
// -------------------------

function ubicarNuevaFicha(posicion, fichas) {

    const movimientos = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ];

    for (const movimiento of movimientos) {

        const fila =
            (posicion[0] + movimiento[0] + FILAS) % FILAS;

        const columna =
            (posicion[1] + movimiento[1] + COLUMNAS) % COLUMNAS;

        const ocupada = fichas.some(
            ficha =>
                ficha[0] === fila &&
                ficha[1] === columna
        );

        if (!ocupada) {
            return [fila, columna];
        }
    }

    return null;
}

// -------------------------
// EJECUTAR UN TURNO
// -------------------------

function ejecutarTurno(jugador, casas, generador) {

    // Agregar las nuevas fichas al comenzar el turno

    if (jugador.nuevasFichas.length > 0) {

        for (const posicion of jugador.nuevasFichas) {

            const nuevaPosicion = ubicarNuevaFicha(
                posicion,
                jugador.fichas
            );

            if (nuevaPosicion !== null) {

                jugador.fichas.push(nuevaPosicion);

                console.log(
                    "Nueva ficha ubicada en:",
                    nuevaPosicion
                );
            }
        }

        jugador.nuevasFichas = [];
    }

    const dado = tirarDado(generador);

    console.log("\nTurno de:", jugador.nombre);
    console.log("Dado:", dado);

    const nuevasPosiciones = [];
    const movimientosElegidos = [];

    // -------------------------
    // BUSCAR MOVIMIENTO PARA CADA FICHA
    // -------------------------

    for (let i = 0; i < jugador.fichas.length; i++) {

        const movimientos = calcularMovimientosValidos(
            jugador.fichas[i],
            dado,
            jugador.fichas
        );

        if (movimientos.length === 0) {

            jugador.fallosConsecutivos++;

            console.log("Jugada inválida.");

            console.log(
                "Fallos consecutivos:",
                jugador.fallosConsecutivos
            );

            return;
        }

        const movimientoElegido =
            elegirMovimiento(movimientos);

        nuevasPosiciones.push(
            movimientoElegido.posicion
        );

        movimientosElegidos.push(
            movimientoElegido
        );
    }

    // -------------------------
    // COMPROBAR POSICIONES REPETIDAS
    // -------------------------

    for (let i = 0; i < nuevasPosiciones.length; i++) {

        for (let j = i + 1; j < nuevasPosiciones.length; j++) {

            if (
                nuevasPosiciones[i][0] === nuevasPosiciones[j][0] &&
                nuevasPosiciones[i][1] === nuevasPosiciones[j][1]
            ) {

                jugador.fallosConsecutivos++;

                console.log("Jugada inválida.");

                console.log(
                    "Dos fichas terminarían en la misma posición."
                );

                console.log(
                    "Fallos consecutivos:",
                    jugador.fallosConsecutivos
                );

                return;
            }
        }
    }

    // -------------------------
    // GUARDAR NUEVAS POSICIONES
    // -------------------------

    jugador.fichas = nuevasPosiciones;

    jugador.fallosConsecutivos = 0;

    console.log("Movimientos:");

    for (let i = 0; i < movimientosElegidos.length; i++) {

        console.log(
            "Ficha",
            i + 1,
            "-",
            movimientosElegidos[i].direccion,
            "->",
            jugador.fichas[i]
        );
    }

    // -------------------------
    // COMPROBAR CASAS CONQUISTADAS
    // -------------------------

    for (const ficha of jugador.fichas) {

        const indiceCasa = buscarCasa(
            ficha,
            casas
        );

        if (indiceCasa !== -1) {

            const posicionNuevaFicha =
                casas[indiceCasa];

            jugador.casasConquistadas++;

            jugador.nuevasFichas.push(
                posicionNuevaFicha
            );

            casas.splice(
                indiceCasa,
                1
            );

            console.log("¡Casa conquistada!");

            console.log(
                "Nueva ficha disponible en el próximo turno."
            );

            console.log(
                "Casas conquistadas:",
                jugador.casasConquistadas
            );
        }
    }
}

// -------------------------
// PROGRAMA PRINCIPAL
// -------------------------

const semilla =
    Number(process.argv[2]) || 12345;

const casas =
    generarCasas(semilla);

const generador =
    crearGenerador(semilla);

console.log("CASAS EN DISPUTA");

console.log(
    "Semilla:",
    semilla
);

console.log("\nCasas iniciales:");

console.log(casas);

console.log("\nInicio del juego");

let turno = 0;

while (
    turno < MAX_TURNOS &&
    casas.length > 0
) {

    turno++;

    if (turno % 2 === 1) {

        ejecutarTurno(
            jugador1,
            casas,
            generador
        );

    } else {

        ejecutarTurno(
            jugador2,
            casas,
            generador
        );
    }
}

// -------------------------
// RESULTADO FINAL
// -------------------------

console.log("\nFIN DEL JUEGO");

console.log(
    "Turnos realizados:",
    turno
);

console.log(
    jugador1.nombre,
    "- casas conquistadas:",
    jugador1.casasConquistadas,
    "- posición:",
    jugador1.fichas
);

console.log(
    jugador2.nombre,
    "- casas conquistadas:",
    jugador2.casasConquistadas,
    "- posición:",
    jugador2.fichas
);

console.log(
    "Casas restantes:",
    casas
);