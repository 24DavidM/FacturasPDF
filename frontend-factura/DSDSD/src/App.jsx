import { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Selecciona un archivo PDF');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('/api/facturas', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir el archivo');
      }

      const data = await response.json();
      alert('Archivo subido y procesado correctamente');
      console.log(data);
    } catch (error) {
      console.error(error);
      alert('Error al subir archivo');
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input type="file" name="pdf" accept="application/pdf" onChange={handleFileChange} required />
      <button type="submit">Subir PDF</button>
    </form>
  );
}

export default App;
