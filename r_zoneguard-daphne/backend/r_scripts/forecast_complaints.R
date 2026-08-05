# backend/r_scripts/forecast_complaints.R
suppressPackageStartupMessages({
  library(jsonlite)
})

args <- commandArgs(trailingOnly = TRUE)

if (length(args) == 0 || !file.exists(args[1])) {
  cat(toJSON(list(status = "fallback", forecast = c(12, 14, 13)), auto_unbox = TRUE))
  quit(status = 0)
}

input_data <- tryCatch({
  fromJSON(args[1])
}, error = function(e) {
  return(NULL)
})

if (!is.null(input_data) && is.data.frame(input_data) && nrow(input_data) >= 2) {
  df <- data.frame(month_num = 1:nrow(input_data), count = as.numeric(input_data$count))
  model <- lm(count ~ month_num, data = df)
  
  future_months <- data.frame(month_num = (nrow(input_data) + 1):(nrow(input_data) + 3))
  predictions <- predict(model, newdata = future_months)
  
  result <- list(
    status = "success",
    historical_count = nrow(input_data),
    forecast = pmax(0, round(as.numeric(predictions), 1))
  )
} else {
  result <- list(
    status = "insufficient_data",
    forecast = c(10, 12, 11)
  )
}

cat(toJSON(result, auto_unbox = TRUE))