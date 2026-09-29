import { useCallback, useEffect, useState } from 'react';
import DocumentList from './components/DocumentList';
import UploadComponent from './components/UploadComponent';
import { listDocuments } from './services/documentsApi';
import './App.css';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      setDocuments(await listDocuments());
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  function handleUploaded(document) {
    setDocuments((currentDocuments) => [document, ...currentDocuments]);
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <p className="brand-mark">DMS / Arquivo local</p>
      </header>

      <main className="main-content">
        <section className="intro">
          <p className="eyebrow">Document Management System</p>
          <h1>Seus arquivos, em um só lugar.</h1>
          <p>Envie, organize e recupere documentos com rapidez.</p>
        </section>

        <section className="workspace">
          <UploadComponent onUploaded={handleUploaded} />
          <DocumentList
            documents={documents}
            isLoading={isLoading}
            error={error}
            onRetry={loadDocuments}
          />
        </section>
      </main>
    </div>
  );
}
