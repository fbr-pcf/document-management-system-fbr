import { getDocumentDownloadUrl } from '../services/documentsApi';

export default function DownloadButton({ document }) {
  return (
    <a
      className="download-button"
      href={getDocumentDownloadUrl(document.id)}
      download={document.originalName}
    >
      Baixar
    </a>
  );
}
