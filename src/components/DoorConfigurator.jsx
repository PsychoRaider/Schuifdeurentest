
import React, { useMemo } from "react";
import {
  Paper, Stack, Typography, Button, Grid, FormControl, InputLabel, Select, MenuItem,
  TextField, Checkbox, FormControlLabel, Box, Divider, Chip, IconButton, Tooltip
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { RULES } from "../lib/pricingRules";

function DoorConfigurator({
  door,
  index,
  onUpdate,
  onRemove,
  onDuplicate
}) {
  const current = RULES.products[door.product];

  const validW = door.width >= current.baseW && door.width <= current.maxW;
  const validH = door.height >= current.baseH && door.height <= current.maxH;
  const isValid = validW && validH;

  const area = useMemo(() => (door.width / 1000) * (door.height / 1000), [door.width, door.height]);

  const selectableOptions = useMemo(
    () => [...Object.keys(RULES.areaOptions), ...Object.keys(RULES.selectableFlatOptions)],
    []
  );
  const countedOptionKeys = Object.keys(RULES.fixedCountOptions);

  const setField = (patch) => onUpdate({ ...door, ...patch });

  const resetDoor = () => {
    const base = RULES.products["Type A"];
    onUpdate({
      ...door,
      product: "Type A",
      width: base.baseW,
      height: base.baseH,
      options: [],
      fixedOptionCounts: { Komgreep: 0, Haakslot: 0, Espagnolet: 0, "Horizontale Regel": 0 },
      region: "Noord-Holland"
    });
  };

  const toggleOption = (opt, checked) => {
    const next = checked
      ? [...door.options, opt]
      : door.options.filter((o) => o !== opt);
    setField({ options: next });
  };

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h6">Deur #{index + 1}</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title={door.collapsed ? "Uitklappen" : "Inklappen"}>
            <IconButton onClick={() => setField({ collapsed: !door.collapsed })} aria-label="toggle door">
              {door.collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Dupliceren">
            <IconButton onClick={onDuplicate} aria-label="duplicate door">
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Verwijderen">
            <IconButton onClick={onRemove} aria-label="remove door" color="error">
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
          <Button onClick={resetDoor} variant="text">Reset</Button>
        </Stack>
      </Stack>

      {door.collapsed ? null : (
        <>
          {/* Product & Region */}
          <Grid container spacing={2} sx={{ mb: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id={`product-label-${door.id}`}>Product</InputLabel>
                <Select
                  labelId={`product-label-${door.id}`}
                  label="Product"
                  value={door.product}
                  onChange={(e) => {
                    const next = e.target.value;
                    const p = RULES.products[next];
                    setField({ product: next, width: p.baseW, height: p.baseH });
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
                <InputLabel id={`region-label-${door.id}`}>Provincie</InputLabel>
                <Select
                  labelId={`region-label-${door.id}`}
                  label="Provincie"
                  value={door.region}
                  onChange={(e) => setField({ region: e.target.value })}
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
                value={door.width}
                onChange={(e) => setField({ width: Number(e.target.value || 0) })}
                onBlur={() =>
                  setField({ width: Math.min(Math.max(door.width, current.baseW), current.maxW) })
                }
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
                value={door.height}
                onChange={(e) => setField({ height: Number(e.target.value || 0) })}
                onBlur={() =>
                  setField({ height: Math.min(Math.max(door.height, current.baseH), current.maxH) })
                }
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
                      checked={door.options.includes(opt)}
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
                  value={door.fixedOptionCounts[opt] ?? 0}
                  onChange={(e) =>
                    setField({
                      fixedOptionCounts: {
                        ...door.fixedOptionCounts,
                        [opt]: Number(e.target.value || 0)
                      }
                    })
                  }
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
            {/* Keep this as a hint button; summary calculates automatically */}
            <Tooltip title="Controleer de grenzen.">
              <span>
                <Button variant="contained" disabled={!isValid}>Berekenen</Button>
              </span>
            </Tooltip>
          </Box>
        </>
      )}
    </Paper>
  );
}

export default DoorConfigurator;
