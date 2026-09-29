import { useRef, useState } from 'react';
import { uploadDocument } from '../services/documentsApi';

export default function UploadComponent({ onUploaded }) {
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  function handleFileChange(event) {
    setSelectedFile(event.target.files[0] || null);
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedFile) {
      setError('Selecione um arquivo para enviar.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const document = await uploadDocument(selectedFile);
      onUploaded(document);
      setSelectedFile(null);
      inputRef.current.value = '';
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form className="upload-panel" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">Novo documento</p>
        <h2>Envie um arquivo</h2>
        <p className="muted">Arquivos armazenados localmente no DMS.</p>
      </div>

      <label className="file-picker">
        <span>{selectedFile ? selectedFile.name : 'Escolher arquivo'}</span>
        <input
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>

      <button className="primary-button" type="submit" disabled={isUploading}>
        {isUploading ? 'Enviando...' : 'Enviar documento'}
      </button>

      {error && <p className="error-message" role="alert">{error}</p>}
    </form>
  );
}
