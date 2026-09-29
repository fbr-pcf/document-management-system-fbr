import DownloadButton from './DownloadButton';

function formatFileSize(size) {
  if (size < 1024) {
    return `${size} B`;
  }

  const units = ['KB', 'MB', 'GB'];
  let value = size;
  let unitIndex = -1;

  do {
    value /= 1024;
    unitIndex += 1;
  } while (value >= 1024 && unitIndex < units.length - 1);

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatUploadDate(date) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}

export default function DocumentList({ documents, isLoading, error, onRetry }) {
  if (isLoading) {
    return <p className="status-message">Carregando documentos...</p>;
  }

  if (error) {
    return (
      <div className="status-message error-message" role="alert">
        <p>{error}</p>
        <button className="secondary-button" type="button" onClick={onRetry}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <section className="documents-section" aria-labelledby="documents-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Biblioteca</p>
          <h2 id="documents-title">Seus documentos</h2>
        </div>
        <span className="document-count">{documents.length}</span>
      </div>

      {documents.length === 0 ? (
        <p className="empty-state">Nenhum documento enviado ainda.</p>
      ) : (
        <div className="document-list">
          {documents.map((document) => (
            <article className="document-row" key={document.id}>
              <div className="document-icon" aria-hidden="true">DOC</div>
              <div className="document-details">
                <h3 title={document.originalName}>{document.originalName}</h3>
                <p>{formatFileSize(document.size)} · {formatUploadDate(document.uploadedAt)}</p>
              </div>
              <DownloadButton document={document} />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
