/* =================================
   ELEMENTOS PRINCIPALES
   ================================= */

const botonAbrir =
    document.getElementById("abrirRegalo");

const musicaFondo =
    document.getElementById("musicaFondo");

const pantallaInicio =
    document.getElementById("inicio");

const escenario =
    document.getElementById("escenario");

const fotos = [
    document.querySelector(".foto1"),
    document.querySelector(".foto2"),
    document.querySelector(".foto3"),
    document.querySelector(".foto4")
];


/* =================================
   ABRIR REGALO
   ================================= */

botonAbrir.addEventListener("click", function () {

    pantallaInicio.classList.add("oculto");

    escenario.classList.remove("oculto");

    colocarFotos();

    musicaFondo.play();

});


/* =================================
   MOVIMIENTO 360° DEL ESCENARIO
   ================================= */

let anguloActual = 0;

let arrastrandoEscenario = false;

let posicionInicial = 0;

let anguloInicial = 0;

const angulosFotos = [
    -45,
    45,
    135,
    225
];


/* =================================
   COLOCAR FOTOS
   ================================= */

function colocarFotos() {

    const ancho = window.innerWidth;

    let radio;


    /*
       En celular alejamos más
       las fotos del ramo.
    */

    if (ancho <= 700) {

        radio =
            Math.min(
                ancho * 0.65,
                300
            );

    } else {

        radio =
            Math.min(
                ancho * 0.34,
                390
            );

    }


    fotos.forEach(
        function (foto, indice) {

            if (!foto) return;


            const grados =
                angulosFotos[indice]
                + anguloActual;


            const radianes =
                grados * Math.PI / 180;


            const x =
                Math.cos(radianes)
                * radio;


            const y =
                Math.sin(radianes)
                * radio;


            const inclinacion = [
                -8,
                7,
                6,
                -7
            ][indice];


            foto.style.left = "50%";

            foto.style.top = "50%";


            foto.style.transform =
                `translate(-50%, -50%)
                 translate(${x}px, ${y}px)
                 rotate(${inclinacion}deg)`;

        }
    );

}


/* =================================
   ARRASTRAR ESCENARIO 360°
   PARA COMPUTADORA
   ================================= */

escenario.addEventListener(
    "pointerdown",
    function (evento) {

        /*
           Si estamos dentro del visor
           no movemos el escenario.
        */

        if (
            evento.target.closest(".visor-foto")
        ) {
            return;
        }


        arrastrandoEscenario = true;


        posicionInicial =
            evento.clientX;


        anguloInicial =
            anguloActual;


        escenario.setPointerCapture(
            evento.pointerId
        );


        escenario.style.cursor =
            "grabbing";

    }
);


escenario.addEventListener(
    "pointermove",
    function (evento) {

        if (!arrastrandoEscenario) return;


        const movimiento =
            evento.clientX
            - posicionInicial;


        anguloActual =
            anguloInicial
            + movimiento * 0.35;


        colocarFotos();

    }
);


escenario.addEventListener(
    "pointerup",
    function (evento) {

        arrastrandoEscenario = false;


        escenario.style.cursor =
            "grab";


        try {

            escenario.releasePointerCapture(
                evento.pointerId
            );

        } catch (error) {}

    }
);


escenario.addEventListener(
    "pointercancel",
    function () {

        arrastrandoEscenario = false;

        escenario.style.cursor =
            "grab";

    }
);


/* =================================
   MOVIMIENTO CON EL DEDO
   CELULAR
   ================================= */

let inicioYEscenario = 0;

let movimientoYEscenario = 0;

let movimientoEscenario = false;


escenario.addEventListener(
    "touchstart",
    function (evento) {

        /*
           Si estamos viendo una foto,
           este movimiento pertenece
           al visor y no al escenario.
        */

        if (
            evento.target.closest(".visor-foto")
        ) {
            return;
        }


        if (
            !evento.touches ||
            evento.touches.length !== 1
        ) {
            return;
        }


        arrastrandoEscenario = true;

        movimientoEscenario = false;


        posicionInicial =
            evento.touches[0].clientX;


        inicioYEscenario =
            evento.touches[0].clientY;


        anguloInicial =
            anguloActual;

    },
    {
        passive: false
    }
);


escenario.addEventListener(
    "touchmove",
    function (evento) {

        if (!arrastrandoEscenario) return;


        if (
            !evento.touches ||
            evento.touches.length !== 1
        ) {
            return;
        }


        evento.preventDefault();


        const movimientoX =
            evento.touches[0].clientX
            - posicionInicial;


        movimientoYEscenario =
            evento.touches[0].clientY
            - inicioYEscenario;


        /*
           DESLIZAR HACIA ARRIBA
           = girar hacia adelante

           DESLIZAR HACIA ABAJO
           = girar hacia atrás
        */

        if (
            Math.abs(movimientoYEscenario) >= 8
        ) {

            movimientoEscenario = true;


            anguloActual =
                anguloInicial
                - movimientoYEscenario * 0.55;


            colocarFotos();

        }


        /*
           También dejamos el movimiento
           horizontal como respaldo.
        */

        else if (
            Math.abs(movimientoX) >= 8
        ) {

            movimientoEscenario = true;


            anguloActual =
                anguloInicial
                + movimientoX * 0.35;


            colocarFotos();

        }

    },
    {
        passive: false
    }
);


escenario.addEventListener(
    "touchend",
    function () {

        arrastrandoEscenario = false;

    },
    {
        passive: true
    }
);


escenario.addEventListener(
    "touchcancel",
    function () {

        arrastrandoEscenario = false;

    },
    {
        passive: true
    }
);


/* =================================
   VISOR DE FOTOGRAFÍAS
   ================================= */

const visorFoto =
    document.getElementById(
        "visorFoto"
    );


const fotoGrande =
    document.getElementById(
        "fotoGrande"
    );


const mensajeFoto =
    document.getElementById(
        "mensajeFoto"
    );


const cerrarFoto =
    document.getElementById(
        "cerrarFoto"
    );


/* =================================
   FOTO ACTUAL
   ================================= */

let fotoActual = 0;


/* =================================
   ABRIR UNA FOTOGRAFÍA
   ================================= */

fotos.forEach(
    function (foto, indice) {

        if (!foto) return;


        foto.addEventListener(
            "click",
            function (evento) {

                evento.stopPropagation();


                /*
                   Si acabamos de deslizar
                   el escenario, no abrimos
                   la foto accidentalmente.
                */

                if (movimientoEscenario) {

                    movimientoEscenario = false;

                    return;

                }


                fotoActual = indice;


                mostrarFoto();


                visorFoto.classList.remove(
                    "oculto"
                );

            }
        );

    }
);


/* =================================
   MOSTRAR FOTO ACTUAL
   ================================= */

function mostrarFoto(direccion = 0) {

    const foto =
        fotos[fotoActual];


    if (!foto) return;


    const imagen =
        foto.querySelector("img");


    if (!imagen) return;


    const ruta =
        imagen.getAttribute("src");


    const mensaje =
        foto.getAttribute(
            "data-mensaje"
        );


    /*
       Quitar animaciones anteriores.
    */

    fotoGrande.classList.remove(
        "foto-desde-derecha",
        "foto-desde-izquierda"
    );


    /*
       Reiniciar animación.
    */

    void fotoGrande.offsetWidth;


    fotoGrande.src = ruta;


    mensajeFoto.textContent =
        mensaje ||
        "Un recuerdo especial para ti 💛";


    /*
       Siguiente foto.
    */

    if (direccion > 0) {

        fotoGrande.classList.add(
            "foto-desde-derecha"
        );

    }


    /*
       Foto anterior.
    */

    else if (direccion < 0) {

        fotoGrande.classList.add(
            "foto-desde-izquierda"
        );

    }

}


/* =================================
   CAMBIAR FOTO
   ================================= */

function cambiarFoto(direccion) {

    fotoActual =
        fotoActual + direccion;


    /*
       Si pasamos de la última,
       volvemos a la primera.
    */

    if (
        fotoActual >= fotos.length
    ) {

        fotoActual = 0;

    }


    /*
       Si retrocedemos desde la primera,
       vamos a la última.
    */

    if (
        fotoActual < 0
    ) {

        fotoActual =
            fotos.length - 1;

    }


    mostrarFoto(direccion);

}


/* =================================
   ARRASTRAR DENTRO DEL VISOR
   ================================= */

let arrastrandoFoto = false;

let inicioXFoto = 0;

let inicioYFoto = 0;

let movimientoXFoto = 0;

let movimientoYFoto = 0;


visorFoto.addEventListener(
    "pointerdown",
    function (evento) {

        if (
            evento.target === cerrarFoto
        ) {
            return;
        }


        arrastrandoFoto = true;


        inicioXFoto =
            evento.clientX;


        inicioYFoto =
            evento.clientY;


        movimientoXFoto = 0;

        movimientoYFoto = 0;


        visorFoto.setPointerCapture(
            evento.pointerId
        );

    }
);


visorFoto.addEventListener(
    "pointermove",
    function (evento) {

        if (!arrastrandoFoto) return;


        movimientoXFoto =
            evento.clientX
            - inicioXFoto;


        movimientoYFoto =
            evento.clientY
            - inicioYFoto;

    }
);


visorFoto.addEventListener(
    "pointerup",
    function (evento) {

        if (!arrastrandoFoto) return;


        arrastrandoFoto = false;


        const distanciaMinima = 60;


        if (
            Math.abs(movimientoXFoto)
            >
            Math.abs(movimientoYFoto)
        ) {

            if (
                Math.abs(movimientoXFoto)
                >= distanciaMinima
            ) {

                /*
                   Izquierda = siguiente
                */

                if (
                    movimientoXFoto < 0
                ) {

                    cambiarFoto(1);

                }


                /*
                   Derecha = anterior
                */

                else {

                    cambiarFoto(-1);

                }

            }

        }


        try {

            visorFoto.releasePointerCapture(
                evento.pointerId
            );

        } catch (error) {}

    }
);


visorFoto.addEventListener(
    "pointercancel",
    function () {

        arrastrandoFoto = false;

    }
);


/* =================================
   CONTROL TÁCTIL DEL VISOR
   CELULAR
   ================================= */

let inicioTouchVisorX = 0;

let inicioTouchVisorY = 0;

let moviendoTouchVisor = false;


visorFoto.addEventListener(
    "touchstart",
    function (evento) {

        if (
            evento.target === cerrarFoto
        ) {
            return;
        }


        if (
            !evento.touches ||
            evento.touches.length !== 1
        ) {
            return;
        }


        inicioTouchVisorX =
            evento.touches[0].clientX;


        inicioTouchVisorY =
            evento.touches[0].clientY;


        moviendoTouchVisor = false;

    },
    {
        passive: false
    }
);


visorFoto.addEventListener(
    "touchmove",
    function (evento) {

        if (
            !evento.touches ||
            evento.touches.length !== 1
        ) {
            return;
        }


        const movimientoX =
            evento.touches[0].clientX
            - inicioTouchVisorX;


        const movimientoY =
            evento.touches[0].clientY
            - inicioTouchVisorY;


        if (
            Math.abs(movimientoX) > 10 ||
            Math.abs(movimientoY) > 10
        ) {

            moviendoTouchVisor = true;

            evento.preventDefault();

        }

    },
    {
        passive: false
    }
);


visorFoto.addEventListener(
    "touchend",
    function (evento) {

        if (!moviendoTouchVisor) {
            return;
        }


        const movimientoX =
            evento.changedTouches[0].clientX
            - inicioTouchVisorX;


        const movimientoY =
            evento.changedTouches[0].clientY
            - inicioTouchVisorY;


        const distanciaMinima = 45;


        /*
           Si el movimiento horizontal
           es mayor que el vertical.
        */

        if (
            Math.abs(movimientoX)
            >=
            Math.abs(movimientoY)
        ) {

            if (
                Math.abs(movimientoX)
                >= distanciaMinima
            ) {

                /*
                   Izquierda = siguiente
                */

                if (
                    movimientoX < 0
                ) {

                    cambiarFoto(1);

                }


                /*
                   Derecha = anterior
                */

                else {

                    cambiarFoto(-1);

                }

            }

        }


        /*
           Movimiento vertical.
        */

        else {

            if (
                Math.abs(movimientoY)
                >= distanciaMinima
            ) {

                /*
                   Arriba = siguiente
                */

                if (
                    movimientoY < 0
                ) {

                    cambiarFoto(1);

                }


                /*
                   Abajo = anterior
                */

                else {

                    cambiarFoto(-1);

                }

            }

        }


        moviendoTouchVisor = false;

    },
    {
        passive: false
    }
);


/* =================================
   CERRAR VISOR
   ================================= */

cerrarFoto.addEventListener(
    "click",
    function (evento) {

        evento.stopPropagation();

        cerrarVisor();

    }
);


function cerrarVisor() {

    visorFoto.classList.add(
        "oculto"
    );


    fotoGrande.src = "";


    mensajeFoto.textContent = "";

}


/* =================================
   CLIC FUERA DE LA FOTO
   ================================= */

visorFoto.addEventListener(
    "click",
    function (evento) {

        if (
            evento.target === visorFoto
        ) {

            cerrarVisor();

        }

    }
);


/* =================================
   TECLADO
   ================================= */

document.addEventListener(
    "keydown",
    function (evento) {

        if (
            visorFoto.classList.contains(
                "oculto"
            )
        ) {

            return;

        }


        /*
           Flecha derecha = anterior
        */

        if (
            evento.key === "ArrowRight"
        ) {

            cambiarFoto(-1);

        }


        /*
           Flecha izquierda = siguiente
        */

        if (
            evento.key === "ArrowLeft"
        ) {

            cambiarFoto(1);

        }


        /*
           ESC = cerrar
        */

        if (
            evento.key === "Escape"
        ) {

            cerrarVisor();

        }

    }
);


/* =================================
   CAMBIO DE TAMAÑO
   ================================= */

window.addEventListener(
    "resize",
    function () {

        colocarFotos();

    }
);


escenario.style.cursor =
    "grab";


/* =================================
   PÉTALOS CAYENDO
   ================================= */

const contenedorPetalos =
    document.getElementById(
        "petalos"
    );


function crearPetalo() {

    if (!contenedorPetalos) return;


    const petalo =
        document.createElement("div");


    petalo.classList.add(
        "petalo"
    );


    const posicion =
        Math.random() * 100;


    const tamaño =
        8 + Math.random() * 10;


    const duracion =
        5 + Math.random() * 6;


    const retraso =
        Math.random() * 2;


    petalo.style.left =
        posicion + "%";


    petalo.style.width =
        tamaño + "px";


    petalo.style.height =
        tamaño * 1.4 + "px";


    petalo.style.animationDuration =
        duracion + "s";


    petalo.style.animationDelay =
        retraso + "s";


    contenedorPetalos.appendChild(
        petalo
    );


    setTimeout(
        function () {

            petalo.remove();

        },
        (duracion + retraso) * 1000 + 500
    );

}


/* Crear pétalos continuamente */

setInterval(
    function () {

        crearPetalo();

    },
    450
);
