
import React, { memo } from "react";
import { Paper, Stack, Typography, Divider, List, ListItem, Box } from "@mui/material";
import { formatEUR } from "../lib/format";

function PriceSummary({ breakdown, total, isValid, product }) {
  return (
    <Paper variant="outlined" sx={{ p: 3, position: { md: "sticky" }, top: { md: 24 } }}>
      <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
        <Typography variant="h6">Prijs Overzicht</Typography>
      </Stack>

      <List dense aria-label="Prijs specificatie">
        {breakdown.map((line, idx) => (
          <ListItem key={idx} disableGutters sx={{ px: 0 }}>
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

      <Divider sx={{ my: 2 }} />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Totaal</Typography>
        <Typography variant="h6" aria-live="polite" sx={{ fontWeight: 800 }}>
          {formatEUR(total)}
        </Typography>
      </Stack>

      {!isValid ? (
        <Typography color="error" sx={{ mt: 2 }}>
          De afmetingen liggen buiten de toegestane waarden voor {product}. Pas de breedte/hoogte aan.
        </Typography>
      ) : null}
    </Paper>
  );
}

export default memo(PriceSummary);

