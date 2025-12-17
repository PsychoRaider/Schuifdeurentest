
import React, { memo, useMemo } from "react";
import { Paper, Stack, Typography, Divider, List, ListItem, Box } from "@mui/material";
import { calculate } from "../lib/calculator";
import { formatEUR } from "../lib/format";

function CombinedSummary({ doors }) {
  const results = useMemo(
    () =>
      doors.map((d) =>
        calculate({
          productKey: d.product,
          widthMm: d.width,
          heightMm: d.height,
          selectedOptions: d.options,
          fixedCounts: d.fixedOptionCounts,
          region: d.region
        })
      ),
    [doors]
  );

  const grandTotal = useMemo(() => results.reduce((sum, r) => sum + r.total, 0), [results]);

  return (
    <Paper variant="outlined" sx={{ p: 3, position: { md: "sticky" }, top: { md: 24 } }}>
      <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
        <Typography variant="h6">Overzicht (Alle deuren)</Typography>
      </Stack>

      {doors.map((door, idx) => {
        const res = results[idx];
        const title = `Deur #${idx + 1} — ${door.product}`;
        return (
          <Box key={door.id} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{title}</Typography>
            <List dense aria-label={`Prijs specificatie ${title}`}>
              {res.breakdown.map((line, i) => (
                <ListItem key={`${door.id}-${i}`} disableGutters sx={{ px: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                    <Typography
                      sx={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                      title={line.label}
                    >
                      {line.label}
                    </Typography>
                    <Typography sx={{ flexShrink: 0, minWidth: 96, textAlign: "right" }} title={formatEUR(line.amount)}>
                      {formatEUR(line.amount)}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography>Totaal voor deze deur</Typography>
              <Typography sx={{ fontWeight: 700 }}>{formatEUR(res.total)}</Typography>
            </Stack>
            {idx < doors.length - 1 ? <Divider sx={{ my: 2 }} /> : null}
          </Box>
        );
      })}

      <Divider sx={{ my: 2 }} />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Totaal (alle deuren)</Typography>
        <Typography variant="h6" aria-live="polite" sx={{ fontWeight: 800 }}>
          {formatEUR(grandTotal)}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default memo(CombinedSummary);
