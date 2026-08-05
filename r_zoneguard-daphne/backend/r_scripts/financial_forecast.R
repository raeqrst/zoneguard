library(forecast)
library(jsonlite)

# 1. Read the financial dataset exported from Express
csv_file <- "input_financials.csv"
if (file.exists(csv_file)) {
  df <- read.csv(csv_file)
  data_vector <- df$total_revenue
  month_labels <- as.character(df$month)
} else {
  # Fallback if the database is entirely empty
  data_vector <- c(21500, 23200, 22000, 26500, 27600)
  month_labels <- c("MAR", "APR", "MAY", "JUN", "JUL")
}

# 2. Fit ARIMA model using ALL historical financial data
ts_data <- ts(data_vector, frequency = 12)
fit <- auto.arima(ts_data)

# Forecast exactly 3 months ahead
fc <- forecast(fit, h = 3) 

# 3. Calculate the names of the next 3 forecast months dynamically
all_months_ref <- c("JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC")
last_month <- tail(month_labels, n = 1)

# Clean up last_month in case it has "(cur.)" in the string
last_month_clean <- gsub(" \\(cur\\.\\)", "", toupper(last_month))
last_month_idx <- match(last_month_clean, all_months_ref)

next_labels <- c()
if (!is.na(last_month_idx)) {
  for(i in 1:3) {
    next_idx <- (last_month_idx + i - 1) %% 12 + 1
    next_labels <- c(next_labels, paste0(all_months_ref[next_idx], " (F)"))
  }
} else {
  next_labels <- c("Next 1 (F)", "Next 2 (F)", "Next 3 (F)")
}

# 4. SLICE the display array to show only the last 5 months of history
display_window <- 5
recent_history <- tail(data_vector, n = display_window)
recent_labels <- tail(month_labels, n = display_window)

# Mark the last historical month as "Current"
if (length(recent_labels) > 0) {
  recent_labels[length(recent_labels)] <- paste0(recent_labels[length(recent_labels)], " (cur.)")
}

final_labels <- c(recent_labels, next_labels)

# 5. Export results
forecast_output <- list(
  historical = recent_history,
  projected = round(as.numeric(fc$mean), 1),
  labels = final_labels
)

json_data <- toJSON(forecast_output, auto_unbox = TRUE, pretty = TRUE)
write(json_data, file = "output_financial_forecast.json")