import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Layout } from "./components/Layout";
import { MarketingSite } from "./components/MarketingSite";
import { Contact } from "./pages/Contact";
import { Legal } from "./pages/Legal";
import { Security } from "./pages/Security";
import "./index.css";

const AUXILIARY_ROUTES = new Set(["#/security", "#/contact", "#/legal"]);

function Root() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  useEffect(() => {
    if (AUXILIARY_ROUTES.has(hash)) {
      window.scrollTo(0, 0);
      return;
    }
    const sectionId = hash.startsWith("#") ? hash.slice(1) : "";
    if (!sectionId) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [hash]);

  if (hash === "#/security") return <Layout><Security /></Layout>;
  if (hash === "#/contact") return <Layout><Contact /></Layout>;
  if (hash === "#/legal") return <Layout><Legal /></Layout>;
  return <MarketingSite />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
