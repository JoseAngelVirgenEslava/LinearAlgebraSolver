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
        contenedor.appendChild(input);
        contenedor.appendChild(document.createElement('br'));
    }
}

// Función para resolver el sistema de ecuaciones
function resolverSistema() {
    // Aquí agregar lógica para resolver el sistema
}

// Funciones para validar dimensiones y crear matrices de multiplicación
function validarYCrearMatrices() {
    let filas1 = document.getElementById('filas-matriz1').value;
    let columnas1 = document.getElementById('columnas-matriz1').value;
    let filas2 = document.getElementById('filas-matriz2').value;
    let columnas2 = document.getElementById('columnas-matriz2').value;

    if (columnas1 !== filas2) {
        alert('El número de columnas de la matriz 1 debe coincidir con el número de filas de la matriz 2');
        return;
    }

    // Crear inputs para matrices
    // ...
}

// Función para multiplicar matrices
function multiplicarMatrices() {
    // Aquí agregar lógica de multiplicación de matrices
}

// Funciones para crear y sumar matrices
function crearMatricesSuma() {
    // Crear inputs para matrices de suma
    // ...
}

function sumarMatrices() {
    // Aquí agregar lógica para la suma de matrices
}