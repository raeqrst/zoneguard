suppressMessages(library(jsonlite))
suppressMessages(library(forecast))

args <- commandArgs(trailingOnly = TRUE)
if (length(args) == 0) {
  quit(status = 1)
}

input_json <- args[1]
historical_data <- fromJSON(input_json)

# SAFETY CHECK 1: If data is empty, too short, or a flatline (all 0s)
if (length(historical_data) < 2 || var(historical_data) == 0) {
  last_val <- tail(historical_data, 1)
  if (length(last_val) == 0) last_val <- 0
  
  output <- list(
    historical = historical_data,
    forecast = rep(last_val, 4) # Just project the flatline forward
  )
  cat(toJSON(output, auto_unbox = TRUE))
  quit(status = 0)
}

# SAFETY CHECK 2: Try ARIMA, but fallback to Naive forecasting if data is too weird
ts_data <- ts(historical_data, frequency = 12)

fit <- tryCatch({
    auto.arima(ts_data)
}, error = function(e) {
    return(NA)
})

if (length(fit) == 1 && is.na(fit)) {
   # Fallback if auto.arima fails due to insufficient data points
   forecasted_result <- naive(ts_data, h = 4)
} else {
   forecasted_result <- forecast(fit, h = 4)
}

output <- list(
  historical = historical_data,
  forecast = round(as.numeric(forecasted_result$mean), 2)
)

cat(toJSON(output, auto_unbox = TRUE))