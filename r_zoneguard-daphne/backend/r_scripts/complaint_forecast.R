library(forecast)
library(jsonlite)

# 1. Read the dynamically exported dataset from Express
csv_file <- "input_complaints.csv"
if (file.exists(csv_file)) {
  df <- read.csv(csv_file)
  data_vector <- df$total_count
  month_labels <- as.character(df$month)
} else {
  # Fallback if the database is entirely empty
  data_vector <- c(12, 15, 19, 14, 22, 28, 31)
  month_labels <- c("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul")
}

# 2. Fit ARIMA model using ALL historical data for maximum accuracy
ts_data <- ts(data_vector, frequency = 12)
fit <- auto.arima(ts_data)
fc <- forecast(fit, h = 1) 

# 3. Calculate the name of the forecast month
all_months_ref <- c("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")
last_month <- tail(month_labels, n = 1)
last_month_idx <- match(last_month, all_months_ref)

if (!is.na(last_month_idx)) {
  next_month_idx <- ifelse(last_month_idx == 12, 1, last_month_idx + 1)
  next_month_label <- paste0(all_months_ref[next_month_idx], " (F)")
} else {
  next_month_label <- "Next (F)"
}

# 4. SLICE the display arrays to show ONLY the last 3 months (90 days)
display_window <- 3 
recent_history <- tail(data_vector, n = display_window)
recent_labels <- tail(month_labels, n = display_window)

final_labels <- c(recent_labels, next_month_label)

# 5. Export results
forecast_output <- list(
  historical = recent_history,
  projected = round(as.numeric(fc$mean), 1),
  labels = final_labels
)

json_data <- toJSON(forecast_output, auto_unbox = TRUE, pretty = TRUE)
write(json_data, file = "output_forecast.json")