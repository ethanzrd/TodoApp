import styled from "@emotion/styled";
import { CancelRounded } from "@mui/icons-material";
import {
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { RECURRING_FREQUENCIES, MAX_RECURRING_INTERVAL } from "../constants";
import { ColorPalette } from "../theme/themeConfig";

interface RecurringTaskFormProps {
  isRecurring: boolean;
  onRecurringChange: (isRecurring: boolean) => void;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  onFrequencyChange: (frequency: "daily" | "weekly" | "monthly" | "yearly") => void;
  interval: number;
  onIntervalChange: (interval: number) => void;
  endDate: string;
  onEndDateChange: (endDate: string) => void;
}

export const RecurringTaskForm: React.FC<RecurringTaskFormProps> = ({
  isRecurring,
  onRecurringChange,
  frequency,
  onFrequencyChange,
  interval,
  onIntervalChange,
  endDate,
  onEndDateChange,
}) => {
  const theme = useTheme();

  const handleIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || 1;
    if (value >= 1 && value <= MAX_RECURRING_INTERVAL) {
      onIntervalChange(value);
    }
  };

  const getFrequencyLabel = (freq: string) => {
    switch (freq) {
      case "daily":
        return interval === 1 ? "day" : "days";
      case "weekly":
        return interval === 1 ? "week" : "weeks";
      case "monthly":
        return interval === 1 ? "month" : "months";
      case "yearly":
        return interval === 1 ? "year" : "years";
      default:
        return freq;
    }
  };

  return (
    <RecurringContainer>
      <FormControlLabel
        control={
          <Switch
            checked={isRecurring}
            onChange={(e) => onRecurringChange(e.target.checked)}
            color="primary"
          />
        }
        label={
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Make this a recurring task
          </Typography>
        }
      />

      {isRecurring && (
        <RecurringOptions>
          <RecurringRow>
            <Typography variant="body2" sx={{ minWidth: "60px", alignSelf: "center" }}>
              Repeat every
            </Typography>
            <StyledTextField
              type="number"
              value={interval}
              onChange={handleIntervalChange}
              inputProps={{
                min: 1,
                max: MAX_RECURRING_INTERVAL,
              }}
              sx={{ width: "80px" }}
            />
            <FormControl sx={{ minWidth: "120px" }}>
              <InputLabel>Frequency</InputLabel>
              <Select
                value={frequency}
                label="Frequency"
                onChange={(e) =>
                  onFrequencyChange(e.target.value as "daily" | "weekly" | "monthly" | "yearly")
                }
                sx={{
                  borderRadius: "12px",
                }}
              >
                {RECURRING_FREQUENCIES.map((freq) => (
                  <MenuItem key={freq} value={freq}>
                    {getFrequencyLabel(freq)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </RecurringRow>

          <StyledTextField
            label="End date (optional)"
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
              input: {
                endAdornment: endDate ? (
                  <InputAdornment position="end">
                    <Tooltip title="Clear end date">
                      <IconButton color="error" onClick={() => onEndDateChange("")} size="small">
                        <CancelRounded />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ) : undefined,
              },
            }}
            sx={{
              colorScheme: theme.darkmode ? "dark" : "light",
            }}
          />
        </RecurringOptions>
      )}
    </RecurringContainer>
  );
};

const RecurringContainer = styled.div`
  margin: 16px 0;
  padding: 16px;
  border: 1px solid ${({ theme }) => (theme.darkmode ? ColorPalette.darkMode : "#e0e0e0")};
  border-radius: 12px;
  background: ${({ theme }) =>
    theme.darkmode ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)"};
`;

const RecurringOptions = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RecurringRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const StyledTextField = styled(TextField)`
  & .MuiInputBase-root {
    border-radius: 12px;
  }
`;
