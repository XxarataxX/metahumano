import React, { useEffect, useState } from "react";

const SelectorVoz = () => {
  const [voces, setVoces] = useState([]);
  const [vozSeleccionada, setVozSeleccionada] = useState(null);
  const [texto, setTexto] = useState("Hola, soy tu tutor interactivo. ¿Listo para aprender?");

  useEffect(() => {
    const cargarVoces = () => {
      const disponibles = window.speechSynthesis.getVoices();
      setVoces(disponibles);
    };

    // Carga inicial
    cargarVoces();

    // Carga cuando las voces estén disponibles
    window.speechSynthesis.onvoiceschanged = cargarVoces;
  }, []);

  const leerTexto = () => {
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "es-ES";

    if (vozSeleccionada) {
      const voz = voces.find((v) => v.name === vozSeleccionada);
      if (voz) {
        utterance.voice = voz;
      }
    }

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "500px", margin: "0 auto" }}>
      <h2>🔊 Selecciona una voz</h2>

      <select
        onChange={(e) => setVozSeleccionada(e.target.value)}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      >
        <option value="">-- Elige una voz --</option>
        {voces.map((voz, index) => (
          <option key={index} value={voz.name}>
            {voz.name} ({voz.lang})
          </option>
        ))}
      </select>

      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={4}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      />

      <button
        onClick={leerTexto}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#6366f1",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        ▶️ Reproducir texto
      </button>
    </div>
  );
};

export default SelectorVoz;
