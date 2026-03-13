import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-muted gap-4">
    <h1 className="font-display font-bold text-5xl text-foreground">404</h1>
    <p className="font-body text-muted-foreground">Page introuvable.</p>
    <Link to="/" className="font-body text-sm text-primary hover:underline">
      ← Retour à l'accueil
    </Link>
  </div>
);

export default NotFound;
