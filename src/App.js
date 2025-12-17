
import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar, Toolbar, IconButton, Typography, Container, Grid, Box, CssBaseline, Tooltip, Button, Stack
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import DoorConfigurator from "./components/DoorConfigurator";
import CombinedSummary from "./components/CombinedSummary";
import { RULES } from "./lib/pricingRules";

export default function App() {
  // --- Theme (robust init + persistence) ---
  const [mode, setMode] = useState(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("themeMode") : null;
    if (stored === "light" || stored === "dark") return stored;
    const prefersDark =
      typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });
  useEffect(() => {
    try { localStorage.setItem("themeMode", mode); } catch {}
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
        shape: { borderRadius: 12 },
        components: {
          MuiPaper: { styleOverrides: { root: { transition: "background-color .2s ease, color .2s ease, border-color .2s ease" } } },
          MuiAppBar: { styleOverrides: { root: { transition: "background-color .2s ease" } } }
        }
      }),
    [mode]
  );

  // --- Doors state ---
  const createDefaultDoor = (id) => {
    const base = RULES.products["Type A"];
    return {
      id,
      product: "Type A",
      width: base.baseW,
      height: base.baseH,
      options: [],
      fixedOptionCounts: { Komgreep: 0, Haakslot: 0, Espagnolet: 0, "Horizontale Regel": 0 },
      region: "Noord-Holland",
      collapsed: false
    };
  };

  const [doors, setDoors] = useState([createDefaultDoor(Date.now())]);

  const addDoor = () => setDoors((prev) => [...prev, createDefaultDoor(Date.now())]);

  const updateDoor = (id, updated) =>
    setDoors((prev) => prev.map((d) => (d.id === id ? updated : d)));

  const removeDoor = (id) =>
    setDoors((prev) => {
      const next = prev.filter((d) => d.id !== id);
      return next.length === 0 ? [createDefaultDoor(Date.now())] : next;
    });

  const duplicateDoor = (id) =>
    setDoors((prev) => {
      const src = prev.find((d) => d.id === id);
      if (!src) return prev;
      const clone = { ...src, id: Date.now(), collapsed: false };
      // Optional: reset counts or keep them? We keep them for now.
      return [...prev, clone];
    });

  const resetAll = () => setDoors([createDefaultDoor(Date.now())]);

  // --- UI ---
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1 }}>
            Prijs Calculator
          </Typography>
          <Tooltip title={mode === "dark" ? "Schakel licht modus" : "Schakel donker modus"}>
            <IconButton color="inherit" onClick={() => setMode(mode === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box sx={{ bgcolor: "background.default", color: "text.primary", minHeight: "100vh" }}>
        <Container sx={{ py: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Configureer schuifdeuren
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={addDoor}>+ Voeg deur toe</Button>
              <Button variant="text" onClick={resetAll}>Reset alles</Button>
            </Stack>
          </Stack>

          <Grid container spacing={3}>
            {/* LEFT: Multiple door configurators */}
            <Grid item xs={12} md={7}>
              <Stack spacing={2}>
                {doors.map((door, idx) => (
                  <DoorConfigurator
                    key={door.id}
                    door={door}
                    index={idx}
                    onUpdate={(updated) => updateDoor(door.id, updated)}
                    onRemove={() => removeDoor(door.id)}
                    onDuplicate={() => duplicateDoor(door.id)}
                  />
                ))}
              </Stack>
            </Grid>

            {/* RIGHT: Combined summary */}
            <Grid item xs={12} md={5}>
              <CombinedSummary doors={doors} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
