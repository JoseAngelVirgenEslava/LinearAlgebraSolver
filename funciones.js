document.getElementById('boton1').addEventListener('click', () => mostrarSeccion('ecuaciones'));
document.getElementById('boton2').addEventListener('click', () => mostrarSeccion('mult'));
document.getElementById('boton3').addEventListener('click', () => mostrarSeccion('suma'));

function mostrarSeccion(id) {
    document.querySelectorAll('.funcionalidad > div').forEach(div => {
        div.style.display = 'none';
    });
    document.getElementById(id).style.display = 'block';
}

// Función para crear matriz en sistema de ecuaciones
function crearMatrizEcuaciones() {
    let dimension = document.getElementById('dimension-ecuaciones').value;
    let contenedor = document.getElementById('matriz-ecuaciones');
    contenedor.innerHTML = ''; // Limpiar contenedor

    // Crear matriz de coeficientes
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            let input = document.createElement('input');
            input.type = 'number';
            input.className = 'coef';
            input.style.width = '50px';
            input.dataset.row = i;
            input.dataset.col = j;
            contenedor.appendChild(input);
        }
        contenedor.appendChild(document.createElement('br'));
    }

    // Crear vector resultado
    contenedor.appendChild(document.createElement('br'));
    for (let i = 0; i < dimension; i++) {
        let input = document.createElement('input');
        input.type = 'number';
        input.className = 'resultado';
        input.style.width = '50px';
        input.dataset.row = i;
        contenedor.appendChild(input);
        contenedor.appendChild(document.createElement('br'));
    }
}

// Función para resolver el sistema de ecuaciones
function resolverSistema() {
    const coefInputs = document.querySelectorAll('.coef');
    const resultadoInputs = document.querySelectorAll('.resultado');
    const dimension = Math.sqrt(coefInputs.length);

    // Crear matriz de coeficientes
    const matriz = [];
    for (let i = 0; i < dimension; i++) {
        matriz[i] = [];
        for (let j = 0; j < dimension; j++) {
            matriz[i][j] = parseFloat(
                coefInputs[i * dimension + j].value || 0
            );
        }
    }

    // Crear vector resultado
    const vectorResultado = [];
    for (let i = 0; i < dimension; i++) {
        vectorResultado[i] = parseFloat(
            resultadoInputs[i].value || 0
        );
    }

    // Resolver sistema usando eliminación de Gauss
    const solucion = gauss(matriz, vectorResultado);
    if (!solucion) {
        alert('El sistema no tiene solución o es indeterminado.');
        return;
    }

    alert('Solución: ' + solucion.join(', '));
}

// Algoritmo de eliminación de Gauss
function gauss(matriz, vector) {
    const n = matriz.length;

    for (let i = 0; i < n; i++) {
        let max = i;
        for (let j = i + 1; j < n; j++) {
            if (Math.abs(matriz[j][i]) > Math.abs(matriz[max][i])) {
                max = j;
            }
        }

        // Intercambiar filas
        [matriz[i], matriz[max]] = [matriz[max], matriz[i]];
        [vector[i], vector[max]] = [vector[max], vector[i]];

        // Comprobar singularidad
        if (Math.abs(matriz[i][i]) === 0) return null;

        for (let j = i + 1; j < n; j++) {
            const factor = matriz[j][i] / matriz[i][i];
            for (let k = i; k < n; k++) {
                matriz[j][k] -= factor * matriz[i][k];
            }
            vector[j] -= factor * vector[i];
        }
    }

    // Sustitución hacia atrás
    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < n; j++) {
            sum += matriz[i][j] * x[j];
        }
        x[i] = (vector[i] - sum) / matriz[i][i];
    }

    return x;
}

// Funciones para validar y crear matrices de multiplicación
function validarYCrearMatrices() {
    const filas1 = parseInt(document.getElementById('filas-matriz1').value);
    const columnas1 = parseInt(document.getElementById('columnas-matriz1').value);
    const filas2 = parseInt(document.getElementById('filas-matriz2').value);
    const columnas2 = parseInt(document.getElementById('columnas-matriz2').value);

    if (columnas1 !== filas2) {
        alert('El número de columnas de la matriz 1 debe coincidir con el número de filas de la matriz 2.');
        return;
    }

    crearInputsMatriz(filas1, columnas1, 'matriz1');
    crearInputsMatriz(filas2, columnas2, 'matriz2');
}

function crearInputsMatriz(filas, columnas, id) {
    const contenedor = document.getElementById('matrices-multiplicacion');
    contenedor.innerHTML += `<h4>${id}</h4>`;
    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = `${id}`;
            input.dataset.row = i;
            input.dataset.col = j;
            input.style.width = '50px';
            contenedor.appendChild(input);
        }
        contenedor.appendChild(document.createElement('br'));
    }
}

// Función para multiplicar matrices
function multiplicarMatrices() {
    const matriz1 = getMatriz('matriz1');
    const matriz2 = getMatriz('matriz2');
    const resultado = multiplicar(matriz1, matriz2);

    if (!resultado) {
        alert('Dimensiones incompatibles.');
        return;
    }

    mostrarResultado('resultado-multiplicacion', resultado);
}

// Multiplicación de matrices
function multiplicar(matriz1, matriz2) {
    const filas1 = matriz1.length;
    const columnas1 = matriz1[0].length;
    const filas2 = matriz2.length;
    const columnas2 = matriz2[0].length;

    if (columnas1 !== filas2) return null;

    const resultado = Array(filas1)
        .fill(0)
        .map(() => Array(columnas2).fill(0));

    for (let i = 0; i < filas1; i++) {
        for (let j = 0; j < columnas2; j++) {
            for (let k = 0; k < columnas1; k++) {
                resultado[i][j] += matriz1[i][k] * matriz2[k][j];
            }
        }
    }

    return resultado;
}

// Función para sumar matrices
function sumarMatrices() {
    const matriz1 = getMatriz('suma1');
    const matriz2 = getMatriz('suma2');

    if (!matriz1 || !matriz2 || matriz1.length !== matriz2.length || matriz1[0].length !== matriz2[0].length) {
        alert('Las dimensiones no coinciden.');
        return;
    }

    const resultado = matriz1.map((fila, i) => fila.map((val, j) => val + matriz2[i][j]));
    mostrarResultado('resultado-suma', resultado);
}

// Helpers
function getMatriz(clase) {
    const inputs = document.querySelectorAll(`.${clase}`);
    const rows = Math.max(...[...inputs].map(input => parseInt(input.dataset.row))) + 1;
    const cols = Math.max(...[...inputs].map(input => parseInt(input.dataset.col))) + 1;

    const matriz = Array(rows)
        .fill(0)
        .map(() => Array(cols).fill(0));

    inputs.forEach(input => {
        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);
        matriz[row][col] = parseFloat(input.value || 0);
    });

    return matriz;
}

function mostrarResultado(id, resultado) {
    const contenedor = document.getElementById(id);
    contenedor.innerHTML = '';
    resultado.forEach(fila => {
        const row = fila.map(val => `<span>${val.toFixed(2)}</span>`).join(' ');
        contenedor.innerHTML += `<div>${row}</div>`;
    });
}