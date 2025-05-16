import React, { useEffect, useState } from "react";

const QuestionCard = ({ pregunta, index, onResponder, onRelacionadaGenerada }) => {

  const [seleccion, setSeleccion] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [respondida, setRespondida] = useState(false);
  const [puedeContinuar, setPuedeContinuar] = useState(false);

  // 🔁 Resetear el estado cuando cambia la pregunta
  useEffect(() => {
    setSeleccion(null);
    setResultado(null);
    setRespondida(false);
    setPuedeContinuar(false);
  }, [pregunta]);
  const verificarRespuesta = async (opcion) => {
    if (respondida) return;
  
    setSeleccion(opcion);
    const esCorrecta = opcion === pregunta.respuesta_correcta;
    setResultado(esCorrecta ? "correcto" : "incorrecto");
    setRespondida(true);
  
    onResponder(opcion); // feedback inmediato
  
    // Si es incorrecta, pide pregunta relacionada y notifícalo al padre
    if (!esCorrecta) {
      const relacionada = await enviarPreguntaRelacionada(pregunta);
      if (relacionada) {
        console.log("🧪 Callback onRelacionadaGenerada existe:", typeof onRelacionadaGenerada);
        if (typeof onRelacionadaGenerada === "function") {
          onRelacionadaGenerada(relacionada);
        }
      }
    }
    
    setTimeout(() => {
      setPuedeContinuar(true);
    }, 2000);
  };
  

const siguientePregunta = () => {
  if (respondida) {
    onResponder(seleccion); // Opcional: Reenvía la respuesta si es necesario
  }
};

const enviarPreguntaRelacionada = async (pregunta) => {
  try {
    const res = await fetch("http://localhost:8000/pregunta_relacionada/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pregunta: pregunta.pregunta,
        incisos: pregunta.incisos,
        respuesta_correcta: pregunta.respuesta_correcta,
        explicacion: pregunta.explicacion
      }),
    });

    const data = await res.json();

    // Si la API retorna una pregunta relacionada válida
    if (data?.pregunta_generada) {
      console.log("✅ Pregunta relacionada generada:", data.pregunta_generada);
      return data.pregunta_generada;
    }

    // Si no se generó, fallback a una aleatoria
    console.warn("⚠️ Pregunta relacionada no disponible, generando una aleatoria...");
    const fallback = await fetch("http://localhost:8000/preguntas_aleatorias/?cantidad=1");
    const fallbackData = await fallback.json();

    if (fallbackData?.preguntas?.length > 0) {
      const p = fallbackData.preguntas[0];
      const incisos = {};
      p.opciones.forEach((opcion, index) => {
        const letra = String.fromCharCode(65 + index); // "A", "B", "C", ...
        incisos[letra] = opcion;
      });

      const adaptada = {
        pregunta: p.pregunta,
        incisos,
        respuesta_correcta: Object.entries(incisos).find(
          ([_, texto]) => texto === p.respuesta_correcta
        )?.[0] || "A",
        explicacion: p.feedback,
      };

      console.log("🆗 Pregunta aleatoria adaptada como fallback:", adaptada);
      return adaptada;
    }

    console.error("❌ No se pudo obtener ninguna pregunta aleatoria como fallback.");
    return null;
  } catch (error) {
    console.error("❌ Error total al generar pregunta relacionada o fallback:", error);
    return null;
  }
};


  return (
<div style={{
  background: "rgba(255, 255, 255, 0.5)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  padding: "1rem",
  fontFamily: "sans-serif"
}}>
      <h3>Pregunta {index + 1}</h3>
      <p><strong>{pregunta.pregunta}</strong></p>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {Object.entries(pregunta.incisos).map(([letra, texto]) => (
          <li key={letra} style={{ marginBottom: "0.5rem" }}>
            <button
              onClick={() => verificarRespuesta(letra)}
              disabled={respondida}
              style={{
                padding: "0.75rem 1rem",
                background:
                  seleccion === letra
                    ? resultado === "correcto"
                      ? "#4CAF50"
                      : "#F44336"
                    : "#f0f0f0",
                border: "1px solid #ccc",
                borderRadius: "5px",
                cursor: respondida ? "default" : "pointer",
                fontSize: "1rem",
                textAlign: "left"
              }}
            >
              <strong>{letra}:</strong> {texto}
            </button>
          </li>
        ))}
      </ul>

      {respondida && puedeContinuar && (
        <div style={{ marginTop: "1rem" }}>
          <p style={{ color: resultado === "correcto" ? "green" : "red" }}>
            {resultado === "correcto"
              ? "✅ ¡Correcto!"
              : `❌ Incorrecto. La respuesta correcta es ${pregunta.respuesta_correcta}`}
          </p>
          <p style={{ fontStyle: "italic" }}>{pregunta.explicacion}</p>

          <button
            onClick={siguientePregunta}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1.5rem",
              background: "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              fontSize: "1rem",
              cursor: "pointer"
            }}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
