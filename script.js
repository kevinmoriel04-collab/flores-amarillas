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


function colocarFotos() {

    const ancho = window.innerWidth;

    let radio;

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
   ================================= */

escenario.addEventListener(
    "pointerdown",
    function (evento) {

        if (
            evento.target.closest(".foto") ||
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


    /* Quitar animaciones anteriores */

    fotoGrande.classList.remove(
        "foto-desde-derecha",
        "foto-desde-izquierda"
    );


    /*
       Forzamos al navegador a reiniciar
       la animación.
    */

    void fotoGrande.offsetWidth;


    fotoGrande.src = ruta;

    mensajeFoto.textContent =
        mensaje ||
        "Un recuerdo especial para ti 💛";


    /*
       Si vamos hacia la siguiente foto,
       entra desde la derecha.
    */

    if (direccion > 0) {

        fotoGrande.classList.add(
            "foto-desde-derecha"
        );

    }


    /*
       Si vamos hacia la foto anterior,
       entra desde la izquierda.
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

    /*
       direccion = 1
       significa siguiente

       direccion = -1
       significa anterior
    */

    fotoActual =
        fotoActual + direccion;


    /*
       Si pasamos de la última
       volvemos a la primera.
    */

    if (
        fotoActual >= fotos.length
    ) {

        fotoActual = 0;

    }


    /*
       Si retrocedemos desde la primera
       vamos a la última.
    */

    if (fotoActual < 0) {

        fotoActual =
            fotos.length - 1;

    }


    /*
       AQUÍ ESTÁ EL CAMBIO IMPORTANTE:
       ahora enviamos la dirección
       para activar la animación.
    */

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


        /*
           Si el movimiento horizontal
           es mayor que el vertical,
           cambiamos de fotografía.
        */

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
                   Arrastrar hacia la izquierda
                   = siguiente foto
                */

                if (movimientoXFoto < 0) {

                    cambiarFoto(1);

                }


                /*
                   Arrastrar hacia la derecha
                   = foto anterior
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

        /*
           Si hacemos clic directamente
           en el fondo oscuro, cerramos.
        */

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


        if (
            evento.key === "ArrowRight"
        ) {

            cambiarFoto(-1);

        }


        if (
            evento.key === "ArrowLeft"
        ) {

            cambiarFoto(1);

        }


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
    document.getElementById("petalos");

function crearPetalo() {

    if (!contenedorPetalos) return;

    const petalo =
        document.createElement("div");

    petalo.classList.add("petalo");

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

    setTimeout(function () {

        petalo.remove();

    }, (duracion + retraso) * 1000 + 500);

}


/* Crear pétalos continuamente */

setInterval(function () {

    crearPetalo();

}, 450);
