import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useTheme } from "@emotion/react";

interface RecurrenceSelectProps {
  recurrence?: { type: "daily" | "weekly" | "monthly"; interval: number } | null;
  onRecurrenceChange: (
    recurrence: { type: "daily" | "weekly" | "monthly"; interval: number } | null,
  ) => void;
  width?: string;
  fontColor?: string;
}

export const RecurrenceSelect = ({
  recurrence,
  onRecurrenceChange,
  width = "100%",
  fontColor,
}: RecurrenceSelectProps) => {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    if (value === "") {
      onRecurrenceChange(null);
    } else {
      onRecurrenceChange({
        type: value as "daily" | "weekly" | "monthly",
        interval: 1,
      });
    }
  };

  return (
    <FormControl
      fullWidth
      sx={{
        width,
        "& .MuiInputLabel-root": { color: fontColor },
        "& .MuiOutlinedInput-root": {
          borderRadius: "16px",
          "& fieldset": { borderColor: theme.primary },
          "&:hover fieldset": { borderColor: theme.primary },
          "&.Mui-focused fieldset": { borderColor: theme.primary },
        },
      }}
    >
      <InputLabel>Recurrence</InputLabel>
      <Select
        value={recurrence?.type || ""}
        label="Recurrence"
        onChange={handleChange}
        sx={{ color: fontColor }}
      >
        <MenuItem value="">
          <em>No recurrence</em>
        </MenuItem>
        <MenuItem value="daily">Daily</MenuItem>
        <MenuItem value="weekly">Weekly</MenuItem>
        <MenuItem value="monthly">Monthly</MenuItem>
      </Select>
    </FormControl>
  );
};
