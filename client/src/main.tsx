
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, Switch } from "wouter";
import "./index.css";
import GalleryRoot from "./Gallery";
import MuseumEntrance from "./MuseumEntrance";
import { GalleryProvider } from "./context/GalleryContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "./components/ui/tooltip";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GalleryProvider>
          <Switch>
            <Route path="/" component={MuseumEntrance} />
            <Route path="/gallery" component={GalleryRoot} />
          </Switch>
        </GalleryProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>
);
