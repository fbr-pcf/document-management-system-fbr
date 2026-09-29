import { useState } from 'react';
import { loginUser, registerUser } from '../services/documentsApi';

export default function LoginComponent({ onAuthenticated }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const user = isRegistering
        ? await registerUser(email, password)
        : await loginUser(email, password);

      if (isRegistering) {
        await loginUser(email, password);
      }

      onAuthenticated(user);
    } catch (authError) {
      setError(authError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="auth-panel" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">Acesso seguro</p>
        <h2>{isRegistering ? 'Criar conta' : 'Entrar no DMS'}</h2>
        <p className="muted">Seus documentos ficam disponíveis apenas para você.</p>
      </div>

      <label>
        E-mail
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
        />
      </label>

      <label>
        Senha
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
          autoComplete={isRegistering ? 'new-password' : 'current-password'}
        />
      </label>

      <button className="primary-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Aguarde...' : isRegistering ? 'Criar conta' : 'Entrar'}
      </button>

      {error && <p className="error-message" role="alert">{error}</p>}

      <button
        className="text-button"
        type="button"
        onClick={() => {
          setIsRegistering((current) => !current);
          setError('');
        }}
      >
        {isRegistering ? 'Já tenho uma conta' : 'Ainda não tenho uma conta'}
      </button>
    </form>
  );
}