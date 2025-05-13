import React, { useEffect, useState } from "react";

const QuestionCard = ({ pregunta, index, onResponder }) => {
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
const verificarRespuesta = (opcion) => {
  if (respondida) return;

  setSeleccion(opcion);
  const esCorrecta = opcion === pregunta.respuesta_correcta;
  setResultado(esCorrecta ? "correcto" : "incorrecto");
  setRespondida(true);
  
  // 🔥 Envía la respuesta al padre para feedback INMEDIATO (sonido/animación)
  onResponder(opcion);
};

const siguientePregunta = () => {
  if (respondida) {
    onResponder(seleccion); // Opcional: Reenvía la respuesta si es necesario
  }
};

  return (
    <div style={{
      background: "#fff",
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

      {respondida && (
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
