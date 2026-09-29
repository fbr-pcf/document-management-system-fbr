import { useCallback, useEffect, useState } from 'react';
import DocumentList from './components/DocumentList';
import LoginComponent from './components/LoginComponent';
import UploadComponent from './components/UploadComponent';
import {
  getCurrentUser,
  listDocuments,
  logoutUser,
} from './services/documentsApi';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
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
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsCheckingSession(false));
  }, []);

  useEffect(() => {
    if (user) {
      loadDocuments();
    } else {
      setDocuments([]);
    }
  }, [user, loadDocuments]);

  function handleUploaded(document) {
    setDocuments((currentDocuments) => [document, ...currentDocuments]);
  }

  async function handleLogout() {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <p className="brand-mark">DMS / Arquivo local</p>
        {user && (
          <div className="user-actions">
            <span>{user.email}</span>
            <button className="text-button" type="button" onClick={handleLogout}>
              Sair
            </button>
          </div>
        )}
      </header>

      <main className="main-content">
        <section className="intro">
          <p className="eyebrow">Document Management System</p>
          <h1>Seus arquivos, em um só lugar.</h1>
          <p>Envie, organize e recupere documentos com rapidez.</p>
        </section>

        {isCheckingSession ? (
          <p className="status-message">Verificando sessão...</p>
        ) : user ? (
          <section className="workspace">
            <UploadComponent onUploaded={handleUploaded} />
            <DocumentList
              documents={documents}
              isLoading={isLoading}
              error={error}
              onRetry={loadDocuments}
            />
          </section>
        ) : (
          <LoginComponent onAuthenticated={setUser} />
        )}
      </main>
    </div>
  );
}
