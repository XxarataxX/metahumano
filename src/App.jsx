import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { useEffect, useRef, useState } from "react";
import QuestionCard from "./components/QuestionCard";

function App() {
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const hasFetched = useRef(false);
  const [respuestas, setRespuestas] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const experienceRef = useRef();

  
  

 const manejarRespuesta = (respuestaUsuario) => {
  const preguntaActualData = preguntas[preguntaActual];
  const esCorrecta = respuestaUsuario === preguntaActualData.respuesta_correcta;

  // 🔥 Feedback INMEDIATO (sonido + animación)
  if (esCorrecta) {
    const randomAprove = Math.floor(Math.random() * 3) + 1;
    experienceRef.current?.playAudioWithAnimation(`aprove${randomAprove}`);
  } else {
    const randomError = Math.floor(Math.random() * 3) + 1;
    experienceRef.current?.playAudioWithAnimation(`equivocado${randomError}`);
  }

  // Guarda la respuesta y avanza después de un breve delay (opcional)
  setRespuestas((prev) => [
    ...prev,
    { id: preguntaActualData.id || preguntaActual, correcta: esCorrecta },
  ]);

  setTimeout(() => {
    if (preguntaActual + 1 < preguntas.length) {
      setPreguntaActual(preguntaActual + 1);
    } else {
      setMostrarResultados(true);
    }
  }, 10000); // Delay de 2 segundos para ver el feedback
};

useEffect(() => {
  if (hasFetched.current) return;
  hasFetched.current = true;

  console.log("Iniciando solicitud a la API..."); // 1. Log cuando comienza la solicitud

  fetch("http://192.168.100.93:8000/generate_question/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grado: 3,
      dificultad: "fácil",
      materia: "español",
      cantidad: 3
    }),
  })
    .then((res) => {
      console.log("Respuesta recibida, estado:", res.status); // 2. Log del status de la respuesta
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("Datos recibidos de la API:", data); // 3. Log de los datos recibidos
      console.log("Número de preguntas recibidas:", data.quiz.length); // 4. Log de cantidad de preguntas
      setPreguntas(data.quiz);
    })
    .catch((err) => {
      console.error("Error al obtener preguntas:", err); // 5. Log de errores
    });
}, []);
  const avanzar = () => {
    if (preguntaActual + 1 < preguntas.length) {
      setPreguntaActual(preguntaActual + 1);
    } else {
      setMostrarResultados(true);
    }
  };
useEffect(() => {
  if (mostrarResultados) {
    const timer = setTimeout(() => {
      // Reproduce un audio de despedida aleatorio (despedida1, despedida2 o despedida3)
      const randomDespedida = Math.floor(Math.random() * 3) + 1;
      experienceRef.current?.playAudioWithAnimation(`despedida${randomDespedida}`);
    }, 5000); // Espera 5 segundos antes de la despedida

    return () => clearTimeout(timer); // Limpieza del timer
  }
}, [mostrarResultados]);
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* Tarjeta de pregunta actual */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 10,
          maxWidth: "400px",
        }}
      >
        {preguntas.length > 0 && !mostrarResultados && (
          <QuestionCard
            pregunta={preguntas[preguntaActual]}
            index={preguntaActual}
            onResponder={manejarRespuesta}
          />
        )}
      </div>

      {/* ✅ Resultados finales */}
      {mostrarResultados && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            backgroundColor: "#fff",
            padding: "1rem",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            zIndex: 20,
          }}
        >
          <h3>🎉 Resultados</h3>
          <p>✅ Correctas: {respuestas.filter((r) => r.correcta).length}</p>
          <p>❌ Incorrectas: {respuestas.filter((r) => !r.correcta).length}</p>

          <button
            onClick={() => {
              setPreguntaActual(0);
              setRespuestas([]);
              setMostrarResultados(false);

              fetch("http://192.168.1.99:8000/generate_followup_questions/", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  respuestas: respuestas,
                  grado: 3,
                  dificultad: "fácil",
                  materia: "español",
                  cantidad: 3,
                }),
              })
                .then((res) => res.json())
                .then((data) => setPreguntas(data.quiz))
                .catch((err) =>
                  console.error("Error al generar preguntas personalizadas:", err)
                );
            }}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              background: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Reiniciar
          </button>
        </div>
      )}

      {/* Canvas 3D */}
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
        <color attach="background" args={["#ececec"]} />
        <Experience preguntas={preguntas} ref={experienceRef} />
      </Canvas>
    </div>
  );
}

export default App;
