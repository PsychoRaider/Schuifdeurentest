
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  AppBar, Toolbar, IconButton, Typography, Container, Grid, Paper,
  TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel,
  Box, Divider, Chip, Tooltip, CssBaseline, Button, Stack
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { RULES } from "./lib/pricingRules";
import { calculate } from "./lib/calculator";
import PriceSummary from "./components/PriceSummary";

export default function App() {
  // --- Theme (fixed condition + SSR guard) ---
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

  // --- State ---
  const [product, setProduct] = useState("Type A");
  const base = RULES.products["Type A"];
  const [width, setWidth] = useState(base.baseW);
  const [height, setHeight] = useState(base.baseH);

  // Checkbox options (union of areaOptions + flat selectable options)
  const selectableOptions = useMemo(
    () => [...Object.keys(RULES.areaOptions), ...Object.keys(RULES.selectableFlatOptions)],
    []
  );
  const [options, setOptions] = useState([]);

  // Counted options
  const countedOptionKeys = Object.keys(RULES.fixedCountOptions);
  const [fixedOptionCounts, setFixedOptionCounts] = useState({
    Komgreep: 0, Haakslot: 0, Espagnolet: 0, "Horizontale Regel": 0
  });

  const [region, setRegion] = useState("Noord-Holland");

  // --- Derived ---
  const current = RULES.products[product];
  const validW = width >= current.baseW && width <= current.maxW;
  const validH = height >= current.baseH && height <= current.maxH;
  const isValid = validW && validH;

  const { total, breakdown, area } = useMemo(
    () =>
      calculate({
        productKey: product,
        widthMm: width,
        heightMm: height,
        selectedOptions: options,
        fixedCounts: fixedOptionCounts,
        region
      }),
    [product, width, height, options, fixedOptionCounts, region]
  );

  // --- Handlers ---
  const toggleOption = useCallback((opt, checked) => {
    setOptions((prev) => (checked ? [...prev, opt] : prev.filter((o) => o !== opt)));
  }, []);

  const resetToBase = useCallback(() => {
    const p = RULES.products["Type A"];
    setProduct("Type A");
    setWidth(p.baseW);
    setHeight(p.baseH);
    setOptions([]);
    setFixedOptionCounts({ Komgreep: 0, Haakslot: 0, Espagnolet: 0, "Horizontale Regel": 0 });
    setRegion("Noord-Holland");
  }, []);

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
          <Grid container spacing={3}>
            {/* LEFT: Inputs */}
            <Grid item xs={12} md={7}>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="h6">Configuratie</Typography>
                  <Button onClick={resetToBase} variant="text">Reset</Button>
                </Stack>

                {/* Product & Region */}
                <Grid container spacing={2} sx={{ mb: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="product-label">Product</InputLabel>
                      <Select
                        labelId="product-label"
                        label="Product"
                        value={product}
                        onChange={(e) => {
                          const next = e.target.value;
                          setProduct(next);
                          const p = RULES.products[next];
                          setWidth(p.baseW);
                          setHeight(p.baseH);
                        }}
                      >
                        {Object.keys(RULES.products).map((p) => (
                          <MenuItem key={p} value={p}>{p}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="region-label">Provincie</InputLabel>
                      <Select
                        labelId="region-label"
                        label="Provincie"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                      >
                        {Object.keys(RULES.regions).map((r) => (
                          <MenuItem key={r} value={r}>{r}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                {/* Dimensions */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Breedte (mm)"
                      type="number"
                      fullWidth
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      onBlur={() => setWidth(Math.min(Math.max(width, current.baseW), current.maxW))}
                      error={!validW}
                      helperText={`Min: ${current.baseW} mm, Max: ${current.maxW} mm`}
                      inputProps={{ min: current.baseW, max: current.maxW, step: 50 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Hoogte (mm)"
                      type="number"
                      fullWidth
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      onBlur={() => setHeight(Math.min(Math.max(height, current.baseH), current.maxH))}
                      error={!validH}
                      helperText={`Min: ${current.baseH} mm, Max: ${current.maxH} mm`}
                      inputProps={{ min: current.baseH, max: current.maxH, step: 50 }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2, display: "flex", gap: 1, alignItems: "center" }}>
                  <Chip label={`Oppervlakte: ${area.toFixed(2)} m²`} variant="outlined" />
                  {!isValid ? <Chip color="error" label="Afmetingen buiten bereik" /> : null}
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Selectable options */}
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Opties</Typography>
                <Grid container spacing={1}>
                  {selectableOptions.map((opt) => (
                    <Grid item xs={12} sm={6} key={opt}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={options.includes(opt)}
                            onChange={(e) => toggleOption(opt, e.target.checked)}
                          />
                        }
                        label={opt}
                      />
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Fixed option counts */}
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Optieprijzen</Typography>
                <Grid container spacing={2}>
                  {countedOptionKeys.map((opt) => (
                    <Grid item xs={12} sm={6} md={3} key={opt}>
                      <TextField
                        label={opt}
                        type="number"
                        fullWidth
                        inputProps={{ min: 0, max: opt === "Horizontale Regel" ? 4 : 100 }}
                        value={fixedOptionCounts[opt] ?? 0}
                        onChange={(e) => setFixedOptionCounts((prev) => ({ ...prev, [opt]: Number(e.target.value) }))}
                        helperText={
                          opt === "Horizontale Regel"
                            ? "Max 4, prijs per meter breedte"
                            : `€${RULES.fixedCountOptions[opt].price} per stuk`
                        }
                      />
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <Tooltip title="Controleer de grenzen.">
                    <span>
                      <Button variant="contained" disabled={!isValid}>Berekenen</Button>
                    </span>
                  </Tooltip>
                </Box>
              </Paper>
            </Grid>

            {/* RIGHT: Price Summary */}
            <Grid item xs={12} md={5}>
              <PriceSummary breakdown={breakdown} total={total} isValid={isValid} product={product} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

