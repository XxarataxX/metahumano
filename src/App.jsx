import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { useEffect, useRef, useState } from "react";
import QuestionCard from "./components/QuestionCard";
import SelectorVoz from "./components/SelectorVoz";

function App() {
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const hasFetched = useRef(false);
  const [respuestas, setRespuestas] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [finalizado, setFinalizado] = useState(false);
  const [seguimientoGenerado, setSeguimientoGenerado] = useState(false);

  const [matricula, setMatricula] = useState("");
const [iniciado, setIniciado] = useState(false);
const [error, setError] = useState("");

const [cargandoInicio, setCargandoInicio] = useState(false);


useEffect(() => {
  if (cargandoInicio && preguntas.length > 0) {
    const timer = setTimeout(() => {
      setCargandoInicio(false);
    }, 1000); // 1 segundo

    return () => clearTimeout(timer);
  }
}, [cargandoInicio, preguntas]);
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

    setRespuestas((prev) => [
      ...prev,
      {
        id: preguntaActualData.id || preguntaActual,
        correcta: esCorrecta,
        ejemplo: preguntaActualData.pregunta, // Aquí se guarda el ejemplo
      },
    ]);

  setTimeout(() => {
    if (preguntaActual + 1 < preguntas.length) {
      setPreguntaActual(preguntaActual + 1);
    } else {
      setMostrarResultados(true);
    }
  }, 1000); // Delay de 2 segundos para ver el feedback
};

useEffect(() => {
  if (hasFetched.current) return;
  hasFetched.current = true;

  console.log("Iniciando solicitud a la API..."); // 1. Log cuando comienza la solicitud

  fetch("http://192.168.1.99:8000/generate_question/", {
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
      setCargandoInicio(false);
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
  if (!iniciado) {
    return (
      <div
        style={{
          position: "relative",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          fontFamily: "'Poppins', sans-serif",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        {/* 🎈 Animación de fondo */}
        <div style={{ position: "absolute", width: "100%", height: "100%", zIndex: 0 }}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                bottom: `-${Math.random() * 100}px`,
                left: `${Math.random() * 100}%`,
                width: `${10 + Math.random() * 20}px`,
                height: `${10 + Math.random() * 20}px`,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: "50%",
                animation: `floatUp ${8 + Math.random() * 5}s ease-in infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
  
        {/* 💬 Contenido del formulario */}
        <div
          style={{
            zIndex: 10,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            padding: "3rem",
            borderRadius: "25px",
            boxShadow: "0 15px 40px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
            width: "90%",
            maxWidth: "460px",
            backdropFilter: "blur(10px)",
          }}
        >
          <h1
            style={{
              fontSize: "2.1rem",
              fontWeight: "700",
              marginBottom: "1rem",
              color: "#333",
            }}
          >
            🤖 ¡Hola! Soy tu <span style={{ color: "#6366f1" }}>Tutor IA</span>
          </h1>
          <p
            style={{
              color: "#555",
              fontSize: "1rem",
              marginBottom: "2rem",
            }}
          >
            Ingresa tu matrícula para comenzar tu aventura de aprendizaje interactivo.
          </p>
  
          <input
            type="text"
            placeholder="Ej. A12345678"
            value={matricula}
            onChange={(e) => {
              setMatricula(e.target.value);
              if (error) setError(""); // limpia el error si empieza a escribir
            }}
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: "14px",
              border: error ? "2px solid #dc2626" : "2px solid #d1d5db",
              fontSize: "1rem",
              marginBottom: "0.8rem",
              outline: "none",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
            onBlur={(e) => (e.target.style.borderColor = error ? "#dc2626" : "#d1d5db")}
          />
  
          {/* ⚠️ Mensaje de error */}
          {error && (
            <p style={{ color: "#dc2626", fontSize: "0.9rem", marginBottom: "1rem" }}>
              {error}
            </p>
          )}
  
          <button
          onClick={() => {
            if (matricula.trim() !== "") {
              setIniciado(true);          // Activa la pantalla posterior
              setCargandoInicio(true);    // Muestra el spinner
              setError("");               // Limpia error si había
            } else {
              setError("Por favor, ingresa una matrícula válida.");
            }
          }}
            style={{
              background: "linear-gradient(to right, #6366f1, #7c3aed)",
              color: "#fff",
              border: "none",
              padding: "1rem 2.4rem",
              borderRadius: "14px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 8px 25px rgba(99, 102, 241, 0.3)",
              transition: "transform 0.2s ease, background 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            🚀 Comenzar práctica
          </button>
        </div>
  
        <style>{`
          @keyframes floatUp {
            0% {
              transform: translateY(0);
              opacity: 0.4;
            }
            50% {
              opacity: 0.7;
            }
            100% {
              transform: translateY(-100vh);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  }
  
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
        <SelectorVoz />
{cargandoInicio && preguntas.length === 0 ? (
  <div
    style={{
      position: "absolute",
      top: "52%",           // 🔽 Más abajo del centro
      left: "58%",          // 🔼 Más a la derecha
      transform: "translate(-50%, -50%)",
      textAlign: "center",
      zIndex: 1000,
    }}
  >
    <div className="spinner" />
    <h2 style={{ marginTop: "1rem", fontSize: "1.4rem", color: "#4f46e5", fontWeight: 600 }}>
      🧠 ¡Preparando tu reto!
    </h2>
    <p style={{ fontSize: "1rem", color: "#555", marginTop: "0.5rem" }}>
      Nuestro Tutor IA está generando preguntas personalizadas... 🚀
    </p>

    <style>{`
      .spinner {
        width: 70px;
        height: 70px;
        border: 6px solid rgba(0, 0, 0, 0.1);
        border-top-color: #6366f1;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
) : (
  
  preguntas.length > 0 && !mostrarResultados && !cargando && !cargandoInicio && (

    <QuestionCard
      pregunta={preguntas[preguntaActual]}
      index={preguntaActual}
      onResponder={manejarRespuesta}
    />
  )
)}




      </div>

      {cargando && (
  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "white",
      padding: "1rem",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    }}
  >
    Generando nuevas preguntas...
  </div>
)}

      {/* ✅ Resultados finales */}
      {mostrarResultados && (
  <div
    style={{
      position: "absolute",
      bottom: "30px", // ✅ Parte inferior
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      padding: "1.8rem 2rem",
      borderRadius: "20px",
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
      zIndex: 999,
      width: "90%",
      maxWidth: "420px",
      textAlign: "center",
      animation: "fadeInUp 0.5s ease-out",
    }}
  >
    <h2 style={{ marginBottom: "0.8rem", color: "#222", fontSize: "1.6rem" }}>
      🎉 ¡Resultados!
    </h2>

    <p style={{ fontSize: "1.1rem", margin: "0.5rem 0", color: "#28a745" }}>
      ✅ Correctas: <strong>{respuestas.filter((r) => r.correcta).length}</strong>
    </p>
    <p style={{ fontSize: "1.1rem", margin: "0.5rem 0", color: "#dc3545" }}>
      ❌ Incorrectas: <strong>{respuestas.filter((r) => !r.correcta).length}</strong>
    </p>

    <button
      onClick={async () => {
        if (seguimientoGenerado) {
          setFinalizado(true);
          return;
        }

        setCargando(true);
        setPreguntas([]);
        setMostrarResultados(false);

        try {
          const res = await fetch("http://192.168.1.99:8000/generate_followup_questions/", {
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
          });

          const data = await res.json();
          const nuevas = data.quiz || [];

          if (nuevas.length > 0) {
            setPreguntas(nuevas);
            setPreguntaActual(0);
            setRespuestas([]);
            setMostrarResultados(false);
            setSeguimientoGenerado(true);
          } else {
            setFinalizado(true);
          }
        } catch (err) {
          console.error("Error al generar preguntas personalizadas:", err);
          setFinalizado(true);
        } finally {
          setCargando(false);
        }
      }}
      style={{
        marginTop: "1rem",
        padding: "0.75rem 2rem",
        background: "linear-gradient(to right, #007bff, #4f9dfd)",
        color: "#fff",
        border: "none",
        fontSize: "1rem",
        borderRadius: "10px",
        cursor: "pointer",
        boxShadow: "0 4px 15px rgba(0, 123, 255, 0.3)",
        transition: "all 0.3s ease-in-out",
      }}
      onMouseOver={(e) => (e.currentTarget.style.background = "#0056b3")}
      onMouseOut={(e) => (e.currentTarget.style.background = "linear-gradient(to right, #007bff, #4f9dfd)")}
    >
      🔄 Continuar práctica
    </button>
  </div>
)}


{finalizado && (
  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(8px)",
      padding: "2rem",
      borderRadius: "15px",
      boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",
      textAlign: "center",
      maxWidth: "400px",
      zIndex: 30,
    }}
  >
    <h2>🎓 ¡Has terminado tu práctica!</h2>
    <p>Gracias por responder. Puedes cerrar esta actividad o reiniciarla desde el principio si lo deseas.</p>
    <button
      onClick={() => {
        setFinalizado(false);
        hasFetched.current = false;
        window.location.reload(); // o puedes resetear todo manualmente
      }}
      style={{
        marginTop: "1rem",
        padding: "0.75rem 1.5rem",
        background: "#28a745",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      🔁 Reiniciar todo
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
