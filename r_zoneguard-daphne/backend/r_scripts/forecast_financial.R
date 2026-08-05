suppressPackageStartupMessages(library(jsonlite))

args <- commandArgs(trailingOnly = TRUE)
if (length(args) == 0) {
  cat(toJSON(list(error = "No input data provided")))
  quit(status = 1)
}

input_data <- fromJSON(args[1])

if (nrow(input_data) >= 2) {
  df <- data.frame(month_num = 1:nrow(input_data), total = input_data$total)
  model <- lm(total ~ month_num, data = df)
  
  future_months <- data.frame(month_num = (nrow(input_data) + 1):(nrow(input_data) + 3))
  predictions <- predict(model, newdata = future_months)
  
  result <- list(
    status = "success",
    forecast = pmax(0, round(as.numeric(predictions), 2))
  )
} else {
  result <- list(
    status = "insufficient_data",
    forecast = c(0, 0, 0)
  )
}

cat(toJSON(result, auto_unbox = TRUE))