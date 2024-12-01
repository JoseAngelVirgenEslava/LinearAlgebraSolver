document.getElementById('boton1').addEventListener('click', () => mostrarSeccion('ecuaciones'));
document.getElementById('boton2').addEventListener('click', () => mostrarSeccion('mult'));
document.getElementById('boton3').addEventListener('click', () => mostrarSeccion('suma'));

function mostrarSeccion(id) {
    document.querySelectorAll('.funcionalidad > div').forEach(div => {
        div.style.display = 'none';
    });
    document.getElementById(id).style.display = 'flex';
}

// Función para crear matriz en sistema de ecuaciones
function crearMatrizEcuaciones() {
    const dimension = parseInt(document.getElementById("dimension-ecuaciones").value);
    const matrizEcuaciones = document.getElementById("matriz-ecuaciones");

    if (!dimension || dimension < 2 || dimension > 10) {
        matrizEcuaciones.innerHTML = "<p>Por favor, introduce una dimensión válida entre 2 y 10.</p>";
        return;
    }

    matrizEcuaciones.innerHTML = ""; // Limpiar contenido previo

    // Crear estructura de la matriz del sistema
    const parenIzquierdo = document.createElement("div");
    parenIzquierdo.textContent = "(";
    parenIzquierdo.classList.add("sistema-parentesis");

    const coeficientes = document.createElement("div");
    coeficientes.classList.add("sistema-coeficientes");
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            const input = document.createElement("input");
            input.type = "number";
            input.placeholder = "0";
            input.classList.add("input-coeficiente");
            input.setAttribute("data-row", i);
            input.setAttribute("data-col", j);
            coeficientes.appendChild(input);
        }
        coeficientes.appendChild(document.createElement("br"));
    }

    const parenDerecho = document.createElement("div");
    parenDerecho.textContent = ")";
    parenDerecho.classList.add("sistema-parentesis");

    // Crear el vector de variables
    const vectorVariables = document.createElement("div");
    vectorVariables.classList.add("sistema-coeficientes");
    for (let i = 0; i < dimension; i++) {
        const varInput = document.createElement("input");
        varInput.type = "text";
        varInput.value = `x${i + 1}`;
        varInput.readOnly = true;
        vectorVariables.appendChild(varInput);
        vectorVariables.appendChild(document.createElement("br"));
    }

    const igual = document.createElement("div");
    igual.textContent = "=";
    igual.style.margin = "0 10px";

    // Crear el vector solución
    const vectorSolucion = document.createElement("div");
    vectorSolucion.classList.add("sistema-coeficientes");
    for (let i = 0; i < dimension; i++) {
        const inputSol = document.createElement("input");
        inputSol.type = "number";
        inputSol.placeholder = "0";
        inputSol.classList.add("input-solucion");
        vectorSolucion.appendChild(inputSol);
        vectorSolucion.appendChild(document.createElement("br"));
    }

    // Agregar todo al contenedor principal
    matrizEcuaciones.appendChild(parenIzquierdo);
    matrizEcuaciones.appendChild(coeficientes);
    matrizEcuaciones.appendChild(parenDerecho);
    matrizEcuaciones.appendChild(vectorVariables);
    matrizEcuaciones.appendChild(igual);
    matrizEcuaciones.appendChild(vectorSolucion);
}

// Función para resolver el sistema de ecuaciones
function resolverSistema() {
    const dimension = parseInt(document.getElementById("dimension-ecuaciones").value);
    const matrizInputs = document.getElementsByClassName("input-coeficiente");
    const vectorSolucionInputs = document.getElementsByClassName("input-solucion");
    const resultadoEcuaciones = document.getElementById("resultado-ecuaciones");

    // Obtener datos de la matriz de coeficientes y el vector solución
    let matrizAumentada = [];
    for (let i = 0; i < dimension; i++) {
        let fila = [];
        for (let j = 0; j < dimension; j++) {
            fila.push(parseFloat(matrizInputs[i * dimension + j].value) || 0);
        }
        fila.push(parseFloat(vectorSolucionInputs[i].value) || 0); // Agregar el término independiente
        matrizAumentada.push(fila);
    }

    // Resolver el sistema usando eliminación Gaussiana
    let soluciones = gaussElimination(matrizAumentada, dimension);

    // Mostrar los resultados en el formato requerido
    if (soluciones) {
        resultadoEcuaciones.innerHTML = ""; // Limpiar resultados anteriores
        const contenedorResultado = document.createElement("div");
        contenedorResultado.classList.add("sistema-contenedor");

        const llaveIzquierda = document.createElement("div");
        llaveIzquierda.textContent = "{";
        llaveIzquierda.classList.add("sistema-parentesis");

        const listaResultados = document.createElement("div");
        listaResultados.innerHTML = soluciones
            .map((valor, index) => `x${index + 1} = ${valor.toFixed(2)}`)
            .join("<br>");

        contenedorResultado.appendChild(llaveIzquierda);
        contenedorResultado.appendChild(listaResultados);
        resultadoEcuaciones.appendChild(contenedorResultado);

        // Guardar en localStorage
        const operaciones = JSON.parse(localStorage.getItem("sistemaEcuaciones")) || [];
        operaciones.push({ dimension, matrizAumentada, soluciones });
        localStorage.setItem("sistemaEcuaciones", JSON.stringify(operaciones));
    } else {
        resultadoEcuaciones.innerHTML =
            "<p style='color: red;'>El sistema no tiene solución única.</p>";
    }
}

function gaussElimination(matriz, dimension) {
    // Aplicar eliminación Gaussiana
    for (let i = 0; i < dimension; i++) {
        // Buscar el pivote
        let maxFila = i;
        for (let k = i + 1; k < dimension; k++) {
            if (Math.abs(matriz[k][i]) > Math.abs(matriz[maxFila][i])) {
                maxFila = k;
            }
        }

        // Intercambiar filas
        let temp = matriz[i];
        matriz[i] = matriz[maxFila];
        matriz[maxFila] = temp;

        // Verificar si el pivote es 0
        if (Math.abs(matriz[i][i]) < 1e-10) {
            return null; // Sistema sin solución única
        }

        // Normalizar la fila del pivote
        for (let j = i + 1; j <= dimension; j++) {
            matriz[i][j] /= matriz[i][i];
        }
        matriz[i][i] = 1;

        // Reducir filas inferiores
        for (let k = i + 1; k < dimension; k++) {
            let factor = matriz[k][i];
            for (let j = i; j <= dimension; j++) {
                matriz[k][j] -= factor * matriz[i][j];
            }
        }
    }

    // Sustitución hacia atrás
    let soluciones = new Array(dimension);
    for (let i = dimension - 1; i >= 0; i--) {
        soluciones[i] = matriz[i][dimension];
        for (let j = i + 1; j < dimension; j++) {
            soluciones[i] -= matriz[i][j] * soluciones[j];
        }
    }

    return soluciones;
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

function crearMatricesMultiplicacion() {
    const filas1 = parseInt(document.getElementById('filas-matriz1').value);
    const columnas1 = parseInt(document.getElementById('columnas-matriz1').value);
    const filas2 = parseInt(document.getElementById('filas-matriz2').value);
    const columnas2 = parseInt(document.getElementById('columnas-matriz2').value);

    const contenedor = document.getElementById('matrices-multiplicacion');

    if (!filas1 || !columnas1 || !filas2 || !columnas2 || columnas1 !== filas2) {
        alert("El número de columnas de la Matriz 1 debe coincidir con el número de filas de la Matriz 2.");
        return;
    }

    contenedor.innerHTML = ''; // Limpiar contenido previo

    const filaMatrices = document.createElement('div');
    filaMatrices.style.display = 'flex';
    filaMatrices.style.alignItems = 'center';

    // Matriz 1 con paréntesis
    const parenIzq1 = document.createElement('span');
    parenIzq1.textContent = '(';
    parenIzq1.style.fontSize = '24px';

    const matriz1 = crearMatriz('matriz1', filas1, columnas1);

    const parenDer1 = document.createElement('span');
    parenDer1.textContent = ')';
    parenDer1.style.fontSize = '24px';

    // Operador de multiplicación
    const operadorMultiplicacion = document.createElement('span');
    operadorMultiplicacion.textContent = '×';
    operadorMultiplicacion.style.fontSize = '24px';
    operadorMultiplicacion.style.margin = '0 10px';

    // Matriz 2 con paréntesis
    const parenIzq2 = document.createElement('span');
    parenIzq2.textContent = '(';
    parenIzq2.style.fontSize = '24px';

    const matriz2 = crearMatriz('matriz2', filas2, columnas2);

    const parenDer2 = document.createElement('span');
    parenDer2.textContent = ')';
    parenDer2.style.fontSize = '24px';

    // Operador de igualdad (se mostrará después)
    const operadorIgual = document.createElement('span');
    operadorIgual.textContent = '=';
    operadorIgual.style.fontSize = '24px';
    operadorIgual.style.margin = '0 10px';
    operadorIgual.style.display = 'none'; // Ocultar inicialmente

    // Matriz resultado con paréntesis (se mostrará después)
    const parenIzqRes = document.createElement('span');
    parenIzqRes.textContent = '(';
    parenIzqRes.style.fontSize = '24px';
    parenIzqRes.style.display = 'none';

    const matrizResultado = crearMatriz('resultado-multiplicacion', filas1, columnas2);
    matrizResultado.style.display = 'none';
    const parenDerRes = document.createElement('span');
    parenDerRes.textContent = ')';
    parenDerRes.style.fontSize = '24px';
    parenDerRes.style.display = 'none';

    const boton_mult = document.getElementById('boton-multiplicar')
    boton_mult.onclick = function () {
        multiplicarMatrices(filas1, columnas1, columnas2, matrizResultado, operadorIgual, parenIzqRes, parenDerRes);
    };

    // Agregar elementos al contenedor de la fila
    filaMatrices.appendChild(parenIzq1);
    filaMatrices.appendChild(matriz1);
    filaMatrices.appendChild(parenDer1);
    filaMatrices.appendChild(operadorMultiplicacion);
    filaMatrices.appendChild(parenIzq2);
    filaMatrices.appendChild(matriz2);
    filaMatrices.appendChild(parenDer2);
    filaMatrices.appendChild(operadorIgual);
    filaMatrices.appendChild(parenIzqRes);
    filaMatrices.appendChild(matrizResultado);
    filaMatrices.appendChild(parenDerRes);

    // Agregar fila de matrices y botón al contenedor principal
    contenedor.appendChild(filaMatrices);
    //contenedor.appendChild(botonMultiplicar);
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

    crearInputsMatriz(filas1, columnas1, '#matriz1');
    crearInputsMatriz(filas2, columnas2, '#matriz2');
    crearMatricesMultiplicacion();
}

function crearInputsMatriz(filas, columnas, id) {
    const contenedor = document.getElementById('matrices-multiplicacion');
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
function multiplicarMatrices(filas1, columnas1, columnas2, matrizResultado, operadorIgual, parenIzqRes, parenDerRes) {
    const matriz1Inputs = document.querySelectorAll('#matriz1 input');
    const matriz2Inputs = document.querySelectorAll('#matriz2 input');
    const resultadoInputs = matrizResultado.querySelectorAll('input');

    const matriz1 = [...matriz1Inputs].map(input => parseFloat(input.value) || 0);
    const matriz2 = [...matriz2Inputs].map(input => parseFloat(input.value) || 0);

    // Multiplicar las matrices
    let resultados = []; // Almacenar los valores calculados
    for (let i = 0; i < filas1; i++) {
        for (let j = 0; j < columnas2; j++) {
            let suma = 0;
            for (let k = 0; k < columnas1; k++) {
                const valor1 = matriz1[i * columnas1 + k];
                const valor2 = matriz2[k * columnas2 + j];
                suma += valor1 * valor2;
            }
            resultadoInputs[i * columnas2 + j].value = suma;
            resultados.push(suma); // Agregar a los resultados
        }
    }

    // Guardar en localStorage
    const operaciones = JSON.parse(localStorage.getItem("multiplicacionMatrices")) || [];
    operaciones.push({ filas1, columnas1, columnas2, matriz1, matriz2, resultados });
    localStorage.setItem("multiplicacionMatrices", JSON.stringify(operaciones));

    // Mostrar el resultado
    operadorIgual.style.display = 'block';
    matrizResultado.style.display = 'flex';
    parenIzqRes.style.display = 'block';
    parenDerRes.style.display = 'block';
}

function cargarDatosGuardados() {
    // Sistema de ecuaciones
    const sistemas = JSON.parse(localStorage.getItem("sistemaEcuaciones")) || [];
    if (sistemas.length > 0) {
        const ultimoSistema = sistemas[sistemas.length - 1];
        const matrizEcuaciones = document.getElementById("matriz-ecuaciones");
        const resultadoEcuaciones = document.getElementById("resultado-ecuaciones");

        // Limpiar contenido anterior
        matrizEcuaciones.innerHTML = "";
        resultadoEcuaciones.innerHTML = "";

        // Reconstruir la matriz aumentada
        const parenIzquierdo = document.createElement("div");
        parenIzquierdo.textContent = "(";
        parenIzquierdo.classList.add("sistema-parentesis");

        const coeficientes = document.createElement("div");
        coeficientes.classList.add("sistema-coeficientes");
        for (let i = 0; i < ultimoSistema.dimension; i++) {
            for (let j = 0; j < ultimoSistema.dimension; j++) {
                const input = document.createElement("input");
                input.type = "number";
                input.value = ultimoSistema.matrizAumentada[i][j];
                input.classList.add("input-coeficiente");
                input.disabled = true; // Solo lectura
                coeficientes.appendChild(input);
            }
            coeficientes.appendChild(document.createElement("br"));
        }

        const parenDerecho = document.createElement("div");
        parenDerecho.textContent = ")";
        parenDerecho.classList.add("sistema-parentesis");

        // Vector de variables (x1, x2, ..., xn)
        const vectorVariables = document.createElement("div");
        vectorVariables.classList.add("sistema-coeficientes");
        for (let i = 0; i < ultimoSistema.dimension; i++) {
            const varInput = document.createElement("input");
            varInput.type = "text";
            varInput.value = `x${i + 1}`;
            varInput.readOnly = true;
            vectorVariables.appendChild(varInput);
            vectorVariables.appendChild(document.createElement("br"));
        }

        // Vector solución
        const vectorSolucion = document.createElement("div");
        vectorSolucion.classList.add("sistema-coeficientes");
        for (let i = 0; i < ultimoSistema.dimension; i++) {
            const input = document.createElement("input");
            input.type = "number";
            input.value = ultimoSistema.matrizAumentada[i][ultimoSistema.dimension];
            input.classList.add("input-solucion");
            input.disabled = true; // Solo lectura
            vectorSolucion.appendChild(input);
            vectorSolucion.appendChild(document.createElement("br"));
        }

        const igual = document.createElement("div");
        igual.textContent = "=";
        igual.style.margin = "0 10px";

        // Agregar al contenedor de ecuaciones
        matrizEcuaciones.appendChild(parenIzquierdo);
        matrizEcuaciones.appendChild(coeficientes);
        matrizEcuaciones.appendChild(parenDerecho);
        matrizEcuaciones.appendChild(vectorVariables);
        matrizEcuaciones.appendChild(igual);
        matrizEcuaciones.appendChild(vectorSolucion);

        // Mostrar resultado
        const contenedorResultado = document.createElement("div");
        contenedorResultado.classList.add("sistema-contenedor");

        const llaveIzquierda = document.createElement("div");
        llaveIzquierda.textContent = "{";
        llaveIzquierda.classList.add("sistema-parentesis");

        const listaResultados = document.createElement("div");
        listaResultados.innerHTML = ultimoSistema.soluciones
            .map((valor, index) => `x${index + 1} = ${valor.toFixed(2)}`)
            .join("<br>");
        listaResultados.classList.add("resultado-sistema");

        contenedorResultado.appendChild(llaveIzquierda);
        contenedorResultado.appendChild(listaResultados);
        resultadoEcuaciones.appendChild(contenedorResultado);
    }

    // Multiplicación de matrices
    const multiplicaciones = JSON.parse(localStorage.getItem("multiplicacionMatrices")) || [];
    if (multiplicaciones.length > 0) {
        const ultimaMultiplicacion = multiplicaciones[multiplicaciones.length - 1];
        const contenedorMultiplicacion = document.getElementById("matrices-multiplicacion");
        contenedorMultiplicacion.innerHTML = "";

        const filaMatrices = document.createElement("div");
        filaMatrices.style.display = "flex";
        filaMatrices.style.alignItems = "center";

        // Matriz 1 con paréntesis
        filaMatrices.appendChild(crearParentesis("("));
        reconstruirMatriz(ultimaMultiplicacion.matriz1, ultimaMultiplicacion.filas1, ultimaMultiplicacion.columnas1, filaMatrices, true);
        filaMatrices.appendChild(crearParentesis(")"));

        // Operador de multiplicación
        const operadorMultiplicacion = document.createElement("span");
        operadorMultiplicacion.textContent = "×";
        operadorMultiplicacion.style.fontSize = "24px";
        operadorMultiplicacion.style.margin = "0 10px";
        filaMatrices.appendChild(operadorMultiplicacion);

        // Matriz 2 con paréntesis
        filaMatrices.appendChild(crearParentesis("("));
        reconstruirMatriz(ultimaMultiplicacion.matriz2, ultimaMultiplicacion.filas2, ultimaMultiplicacion.columnas2, filaMatrices, true); // Asegura la referencia a matriz2
        filaMatrices.appendChild(crearParentesis(")"));

        // Operador de igualdad
        const operadorIgual = document.createElement("span");
        operadorIgual.textContent = "=";
        operadorIgual.style.fontSize = "24px";
        operadorIgual.style.margin = "0 10px";
        filaMatrices.appendChild(operadorIgual);

        // Matriz resultado con paréntesis
        filaMatrices.appendChild(crearParentesis("("));
        reconstruirMatriz(ultimaMultiplicacion.resultados, ultimaMultiplicacion.filas1, ultimaMultiplicacion.columnas2, filaMatrices, true);
        filaMatrices.appendChild(crearParentesis(")"));

        contenedorMultiplicacion.appendChild(filaMatrices);
    }
}

// Función auxiliar para crear paréntesis
function crearParentesis(texto) {
    const paren = document.createElement("span");
    paren.textContent = texto;
    paren.style.fontSize = "24px";
    return paren;
}

// Función auxiliar para reconstruir matrices con clases y estilos
function reconstruirMatriz(matriz, filas, columnas, contenedor, readonly = false) {
    const matrizDiv = document.createElement("div");
    matrizDiv.style.display = "flex";
    matrizDiv.style.flexDirection = "column";

    for (let i = 0; i < filas; i++) {
        const filaDiv = document.createElement("div");
        filaDiv.style.display = "flex";

        for (let j = 0; j < columnas; j++) {
            const input = document.createElement("input");
            input.type = "number";
            input.value = matriz[i * columnas + j];
            input.classList.add("input-dinamico");
            if (readonly) input.disabled = true; // Solo lectura si es resultado
            filaDiv.appendChild(input);
        }

        matrizDiv.appendChild(filaDiv);
    }

    contenedor.appendChild(matrizDiv);
}

// Llamar a la función al cargar la página
window.onload = cargarDatosGuardados;

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
function sumarMatrices(dimension, matrizResultado, operadorIgual, parenIzqRes, parenDerRes) {
    const matriz1Inputs = document.querySelectorAll('#matriz1-suma input');
    const matriz2Inputs = document.querySelectorAll('#matriz2-suma input');
    const resultadoInputs = matrizResultado.querySelectorAll('#resultado-suma input');

    const matriz1 = [...matriz1Inputs].map(input => parseFloat(input.value) || 0);
    const matriz2 = [...matriz2Inputs].map(input => parseFloat(input.value) || 0);
    const resultados = [];

    for (let i = 0; i < dimension * dimension; i++) {
        const suma = parseFloat(matriz1Inputs[i].value) + parseFloat(matriz2Inputs[i].value);
        resultadoInputs[i].value = suma;
        resultados.push(suma);
    }

    // Guardar en localStorage
    const operaciones = JSON.parse(localStorage.getItem("sumaMatrices")) || [];
    operaciones.push({ dimension, matriz1, matriz2, resultados });
    localStorage.setItem("sumaMatrices", JSON.stringify(operaciones));

    // Mostrar el resultado
    operadorIgual.style.display = 'block';
    matrizResultado.style.display = 'flex';
    parenIzqRes.style.display = 'block';
    parenDerRes.style.display = 'block';
}

// Helpers
function getMatriz(clase) {
    const inputs = document.querySelectorAll(`.${clase}`);
    if (inputs.length === 0) {
        console.error(`No se encontraron entradas para la clase ${clase}`);
        return null;
    }
    
    const rows = Math.max(...[...inputs].map(input => parseInt(input.dataset.row))) + 1;
    const cols = Math.max(...[...inputs].map(input => parseInt(input.dataset.col))) + 1;

    const matriz = Array.from({ length: rows }, () => Array(cols).fill(0));

    inputs.forEach(input => {
        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);
        matriz[row][col] = parseFloat(input.value) || 0;
    });

    return matriz;
}

function mostrarResultado(id, resultado) {
    const contenedor = document.getElementById(id);
    if (!contenedor) {
        console.error(`El contenedor con ID '${id}' no existe.`);
        return;
    }

    contenedor.innerHTML = ''; // Limpiar el contenedor
    //contenedor.classList.add('matrices-suma');

    resultado.forEach(fila => {
        const filaDiv = document.createElement('div');
        filaDiv.style.display = 'flex';

        fila.forEach(val => {
            const input = document.createElement('input');
            input.type = 'number';
            input.value = val.toFixed(2);
            input.className = 'input-dinamico resultado-matriz';
            input.disabled = true;
            filaDiv.appendChild(input);
        });

        contenedor.appendChild(filaDiv);
    });
}

function crearMatricesSuma() {
    const dimension = parseInt(document.getElementById('dimension-suma').value);
    const filas = dimension;
    const columnas = dimension;
    const contenedor = document.getElementById('matrices-suma');

    if (!dimension || dimension <= 1) {
        alert("Por favor, ingrese una dimensión válida mayor a 1.");
        return;
    }

    contenedor.innerHTML = ''; // Limpiar contenido previo

    // Crear contenedores para las matrices y sus elementos visuales
    const contenedorPrincipal = document.createElement('div');
    contenedorPrincipal.style.display = 'flex';
    contenedorPrincipal.style.flexDirection = 'column';
    contenedorPrincipal.style.alignItems = 'center';

    const filaMatrices = document.createElement('div');
    filaMatrices.style.display = 'flex';
    filaMatrices.style.alignItems = 'center';
    filaMatrices.style.marginTop = '10px';

    // Matriz 1 con paréntesis
    const parenIzq1 = document.createElement('span');
    parenIzq1.textContent = '(';
    parenIzq1.style.fontSize = '24px';

    const matriz1 = crearMatriz('matriz1-suma', filas, columnas);
    const parenDer1 = document.createElement('span');
    parenDer1.textContent = ')';
    parenDer1.style.fontSize = '24px';

    // Operador de suma
    const operadorSuma = document.createElement('span');
    operadorSuma.textContent = '+';
    operadorSuma.style.fontSize = '24px';
    operadorSuma.style.margin = '0 10px';

    // Matriz 2 con paréntesis
    const parenIzq2 = document.createElement('span');
    parenIzq2.textContent = '(';
    parenIzq2.style.fontSize = '24px';

    const matriz2 = crearMatriz('matriz2-suma', filas, columnas);
    const parenDer2 = document.createElement('span');
    parenDer2.textContent = ')';
    parenDer2.style.fontSize = '24px';

    // Operador de igualdad (se mostrará después)
    const operadorIgual = document.createElement('span');
    operadorIgual.textContent = '=';
    operadorIgual.style.fontSize = '24px';
    operadorIgual.style.margin = '0 10px';
    operadorIgual.style.display = 'none'; // Ocultar inicialmente

    // Matriz resultado con paréntesis (se mostrará después)
    const parenIzqRes = document.createElement('span');
    parenIzqRes.textContent = '(';
    parenIzqRes.style.fontSize = '24px';
    parenIzqRes.style.display = 'none';

    const matrizResultado = crearMatriz('resultado-suma', filas, columnas, true);
    matrizResultado.style.display = 'none';

    const parenDerRes = document.createElement('span');
    parenDerRes.textContent = ')';
    parenDerRes.style.fontSize = '24px';
    parenDerRes.style.display = 'none';

    // Crear y configurar el botón de sumar dinámicamente
    const botonSumar = document.getElementById('sumar')
    botonSumar.onclick = function () {
        sumarMatrices(dimension, matrizResultado, operadorIgual, parenIzqRes, parenDerRes);
    };

    // Agregar elementos al contenedor de la fila
    filaMatrices.appendChild(parenIzq1);
    filaMatrices.appendChild(matriz1);
    filaMatrices.appendChild(parenDer1);
    filaMatrices.appendChild(operadorSuma);
    filaMatrices.appendChild(parenIzq2);
    filaMatrices.appendChild(matriz2);
    filaMatrices.appendChild(parenDer2);
    filaMatrices.appendChild(operadorIgual);
    filaMatrices.appendChild(parenIzqRes);
    filaMatrices.appendChild(matrizResultado);
    filaMatrices.appendChild(parenDerRes);

    // Agregar fila de matrices y botón al contenedor principal
    contenedorPrincipal.appendChild(filaMatrices);

    // Agregar contenedor principal al contenedor de la funcionalidad
    contenedor.appendChild(contenedorPrincipal);
}

function crearMatriz(id, filas, columnas, disabled = false) {
    const matriz = document.createElement('div');
    matriz.id = id;
    matriz.style.display = 'flex';
    matriz.style.flexDirection = 'column';

    for (let i = 0; i < filas; i++) {
        const fila = document.createElement('div');
        fila.style.display = 'flex';

        for (let j = 0; j < columnas; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.value = 0;
            input.className = 'input-dinamico';
            input.disabled = disabled;
            fila.appendChild(input);
        }
        matriz.appendChild(fila);
    }
    return matriz;
}

function ajustarTamañoInput(input) {
    input.style.width = Math.max(input.value.length * 10 + 10, 50) + 'px';
}

// Limpia los datos y el contenido generado en el sistema de ecuaciones
function limpiarSistemaEcuaciones() {
    document.getElementById('dimension-ecuaciones').value = '';
    document.getElementById('matriz-ecuaciones').innerHTML = '';
    document.getElementById('resultado-ecuaciones').innerHTML = '';
}

// Limpia los datos y el contenido generado en la multiplicación de matrices
function limpiarMultiplicacionMatrices() {
    document.getElementById('filas-matriz1').value = '';
    document.getElementById('columnas-matriz1').value = '';
    document.getElementById('filas-matriz2').value = '';
    document.getElementById('columnas-matriz2').value = '';
    document.getElementById('matrices-multiplicacion').innerHTML = '';
}

// Limpia los datos y el contenido generado en la suma de matrices
function limpiarSumaMatrices() {
    document.getElementById('dimension-suma').value = '';
    document.getElementById('matrices-suma').innerHTML = '';
    document.getElementById('resultado-suma').innerHTML = '';
}
