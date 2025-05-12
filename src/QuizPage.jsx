import React, { useEffect, useState } from "react";
// import Avatar from "./components/Avatar"; // Ajusta según tu estructura

function QuizPage() {
  const [preguntas, setPreguntas] = useState([]);

  useEffect(() => {
    fetch("http://192.168.1.99:8000/generate_question/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grado: 3,
        dificultad: "fácil",
        materia: "español",
        cantidad: 3,
      }),
    })
      .then((res) => res.json())
      .then((data) => setPreguntas(data.quiz))
      .catch((err) => console.error("Error al obtener preguntas:", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Preguntas educativas</h1>
      {preguntas.map((p, i) => (
        <div key={i} style={{ marginBottom: "20px" }}>
          <p><strong>{p.pregunta}</strong></p>
          <ul>
            <li>A. {p.incisos.A}</li>
            <li>B. {p.incisos.B}</li>
            <li>C. {p.incisos.C}</li>
          </ul>
          <p>✅ Respuesta correcta: {p.respuesta_correcta}</p>
          <p>ℹ️ Explicación: {p.explicacion}</p>
        </div>
      ))}

      {/* <Avatar /> */}
    </div>
  );
}

export default QuizPage;
