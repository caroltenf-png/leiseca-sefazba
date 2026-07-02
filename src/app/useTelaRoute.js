import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { telaFromPath, pathFromTela } from "./telaRoute.js";

// Substitui o antigo useState("acervo"): a tela ativa passa a viver na URL,
// habilitando deep-linking, histórico do browser e F5 sem perder a tela.
export function useTelaRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const tela = telaFromPath(location.pathname);
  const setTela = useCallback((t) => navigate(pathFromTela(t)), [navigate]);
  return [tela, setTela];
}
