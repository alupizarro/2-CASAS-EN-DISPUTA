# Casas en disputa

## Descripción

Este trabajo consiste en implementar en JavaScript una parte del juego "Casas en disputa".

El programa se ejecuta utilizando Node.js.

El objetivo es representar un tablero de 10 filas por 10 columnas, colocar las posiciones iniciales de los dos jugadores, generar 5 casas mediante una semilla y calcular movimientos válidos.

También se implementa la lógica de turnos, movimiento de las fichas, conquista de casas y generación de nuevas fichas.

## Herramientas utilizadas

* Visual Studio Code
* JavaScript
* Node.js
* Git
* GitHub

## ¿Qué es Node.js?

Node.js permite ejecutar código JavaScript directamente desde la computadora, sin necesidad de utilizar un navegador.

Para ejecutar el programa utilizamos:

```text
node index.js
```

También podemos indicar una semilla:

```text
node index.js 123
```

La semilla permite obtener siempre la misma generación de casas para un mismo valor.

## Tablero

El tablero se representa con 10 filas y 10 columnas.

En el código se utilizan las siguientes constantes:

```javascript
const FILAS = 10;
const COLUMNAS = 10;
const CANTIDAD_CASAS = 5;
const MAX_TURNOS = 50;
```

El tablero se crea mediante la función `crearTablero()`.

Cada posición comienza representada con un punto `"."`.

Las posiciones se representan mediante dos valores:

```text
[fila, columna]
```

Por ejemplo:

```text
[0, 0]
```

representa la primera fila y la primera columna.

## Posiciones iniciales de los jugadores

El Jugador 1 comienza en:

```text
[0, 0]
```

El Jugador 2 comienza en:

```text
[9, 9]
```

Las posiciones se representan dentro de los objetos de cada jugador mediante la propiedad `fichas`.

## Generador mediante semilla

Para generar las casas se utiliza una función llamada `crearGenerador(semilla)`.

La función recibe una semilla y genera una secuencia de valores que se utiliza para determinar las posiciones de las casas.

La función `generarCasas(semilla)` utiliza este generador para crear 5 casas.

Se controla que:

* no haya casas repetidas;
* las casas no ocupen la posición inicial del Jugador 1;
* las casas no ocupen la posición inicial del Jugador 2.

La generación es determinista porque al utilizar la misma semilla se obtiene la misma secuencia y, por lo tanto, las mismas casas.

Por ejemplo, con la semilla `123` se obtuvieron:

```text
[ [ 1, 5 ], [ 3, 1 ], [ 2, 8 ], [ 4, 8 ], [ 7, 3 ] ]
```

## Movimientos válidos

Los movimientos se calculan mediante la función:

```javascript
calcularMovimientosValidos(posicion, cantidad, fichas)
```

Se tienen en cuenta cuatro direcciones:

* arriba
* abajo
* izquierda
* derecha

Para cada dirección se calcula una nueva posición.

Un movimiento no es válido cuando la posición de destino ya está ocupada por otra ficha del mismo jugador.

La función devuelve las opciones de movimiento que sí son válidas.

## Movimiento toroidal

El tablero utiliza un movimiento toroidal.

Esto significa que cuando una ficha llega a uno de los bordes puede continuar por el lado contrario del tablero.

Por ejemplo, si una ficha está en la fila `0` y se mueve hacia arriba, vuelve a la fila `9`.

Esto se implementa utilizando el operador `%` para mantener las posiciones dentro de los límites del tablero.

## Dado

El dado se genera mediante la función:

```javascript
tirarDado(generador)
```

El resultado puede ser un valor entre `1` y `3`.

El mismo generador basado en la semilla permite que las ejecuciones sean reproducibles.

## Turnos

El juego utiliza un máximo de 50 turnos.

Los jugadores se alternan:

* los turnos impares corresponden al Jugador 1;
* los turnos pares corresponden al Jugador 2.

En cada turno se tira el dado y se calculan los movimientos válidos para las fichas del jugador.

## Conquista de casas

Después de realizar los movimientos se comprueba si alguna ficha quedó ubicada sobre una casa.

Cuando una ficha encuentra una casa:

1. La casa es conquistada.
2. Se incrementa la cantidad de casas conquistadas por el jugador.
3. La casa se elimina de la lista de casas disponibles.
4. Se guarda una nueva ficha para ser ubicada en el próximo turno.

## Fin del juego

El juego termina cuando:

* se conquistan todas las casas, o
* se alcanzan los 50 turnos máximos.

Al finalizar se muestran:

* cantidad de turnos realizados;
* casas conquistadas por cada jugador;
* posiciones finales de las fichas;
* casas que quedaron sin conquistar.

# Ejecución con Node.js

Para ejecutar el programa primero se abre la terminal en la carpeta del proyecto:

```text
C:\Users\Pc\DESKTOP\DESPLIEGUE\2-CASAS-EN-DISPUTA>
```

Luego se ejecuta:

```text
node index.js
```

También se puede indicar una semilla:

```text
node index.js 123
```

# Ejemplos de salida

## Ejemplo 1 - Semilla 123

Comando utilizado:

```text
node index.js 123
```

Casas iniciales:

```text
[ [ 1, 5 ], [ 3, 1 ], [ 2, 8 ], [ 4, 8 ], [ 7, 3 ] ]
```

Resultado final:

```text
Turnos realizados: 50
Jugador 1 - casas conquistadas: 0
Jugador 2 - casas conquistadas: 0
Casas restantes: [ [ 1, 5 ], [ 3, 1 ], [ 2, 8 ], [ 4, 8 ], [ 7, 3 ] ]
```

En esta ejecución ninguno de los jugadores conquistó una casa.

## Ejemplo 2 - Semilla 456

Comando utilizado:

```text
node index.js 456
```

Casas iniciales:

```text
[ [ 3, 8 ], [ 3, 7 ], [ 3, 9 ], [ 6, 9 ], [ 2, 3 ] ]
```

Durante la ejecución se produjeron conquistas de casas y se generaron nuevas fichas.

Resultado final:

```text
Turnos realizados: 50
Jugador 1 - casas conquistadas: 0
Jugador 2 - casas conquistadas: 3
Casas restantes: [ [ 3, 7 ], [ 2, 3 ] ]
```

Este ejemplo permite comprobar la lógica de conquista y generación de nuevas fichas.

## Ejemplo 3 - Semilla 789

Comando utilizado:

```text
node index.js 789
```

Casas iniciales:

```text
[ [ 6, 2 ], [ 2, 3 ], [ 4, 9 ], [ 8, 0 ], [ 7, 3 ] ]
```

Resultado final:

```text
Turnos realizados: 50
Jugador 1 - casas conquistadas: 1
Jugador 2 - casas conquistadas: 1
Casas restantes: [ [ 6, 2 ], [ 2, 3 ], [ 7, 3 ] ]
```

En este ejemplo los dos jugadores lograron conquistar una casa.

# Decisiones de modelado

Para representar el juego se tomaron las siguientes decisiones:

### Tablero

Se utilizó una matriz de 10 filas por 10 columnas porque el tablero solicitado es de 10x10.

### Posiciones

Las posiciones se representan mediante un arreglo de dos elementos:

```text
[fila, columna]
```

Esto permite identificar cada casilla del tablero.

### Casas

Se decidió generar 5 casas mediante una semilla.

También se controla que las casas no se repitan y que no aparezcan en las posiciones iniciales de los jugadores.

### Semilla

Se implementó un generador propio que recibe una semilla.

La decisión de utilizar una semilla permite repetir una misma ejecución y obtener los mismos resultados para una misma semilla.

### Movimientos

Se separó el cálculo de movimientos de la elección del movimiento.

La función `calcularMovimientosValidos()` busca las posiciones posibles y `elegirMovimiento()` selecciona una de ellas.

### Movimiento toroidal

Se decidió utilizar un tablero toroidal para permitir que las fichas pasen de un borde al borde contrario.

Esto se implementó mediante operaciones con módulo `%`.

### Fichas

Cada jugador comienza con una ficha.

Cuando conquista una casa se guarda una nueva ficha para ser ubicada en el siguiente turno.

### Finalización

Se estableció un máximo de 50 turnos para evitar que la ejecución continúe indefinidamente.

El juego también puede finalizar antes si todas las casas son conquistadas.

# Resultado de las pruebas

Se realizaron tres ejecuciones utilizando diferentes semillas:

| Semilla | Casas conquistadas por Jugador 1 | Casas conquistadas por Jugador 2 | Casas restantes |
| ------- | -------------------------------: | -------------------------------: | --------------: |
| 123     |                                0 |                                0 |               5 |
| 456     |                                0 |                                3 |               2 |
| 789     |                                1 |                                1 |               3 |

Las tres ejecuciones se realizaron mediante Node.js y finalizaron correctamente después de 50 turnos.

Las diferentes semillas generaron diferentes posiciones iniciales de las casas.

# Git

El proyecto fue inicializado utilizando Git para llevar un registro de los cambios.

Commit realizado:

```text
c5800d2 Crear juego Casas en Disputa
```

El estado del repositorio fue comprobado con:

```text
git status
```

y se obtuvo:

```text
On branch master
nothing to commit, working tree clean
```

Esto indica que no había cambios pendientes al momento de la comprobación.

# Archivos del proyecto

La carpeta del proyecto contiene:

```text
2-CASAS-EN-DISPUTA
│
├── INDEX.JS
└── README.md
```

`INDEX.JS` contiene la implementación del juego.

`README.md` contiene la descripción del proyecto, las decisiones de modelado, la forma de ejecución y los ejemplos obtenidos mediante Node.js.
