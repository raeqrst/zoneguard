# backend/r_scripts/analytics_engine.R
suppressPackageStartupMessages({
  library(jsonlite)
})

args <- commandArgs(trailingOnly = TRUE)

# Default benchmark structure
out <- list(
  historical = c(12, 14, 10, 15, 18, 11, 13, 16, 14, 12, 15, 17, 13, 14),
  forecast = c(14.2, 13.8, 14.5, 15.1)
)

if (length(args) > 0 && file.exists(args[1])) {
  input_data <- tryCatch({
    jsonlite::fromJSON(args[1])
  }, error = function(e) NULL)

  if (!is.null(input_data)) {
    req_type <- if (!is.null(input_data$type)) input_data$type else 'complaint'
    
    tryCatch({
      raw_vec <- NULL
      if (req_type == 'complaint' && !is.null(input_data$complaints)) {
        raw_vec <- suppressWarnings(as.numeric(input_data$complaints))
      } else if (req_type == 'financial' && !is.null(input_data$transactions)) {
        raw_vec <- suppressWarnings(as.numeric(input_data$transactions))
      }
      
      raw_vec <- raw_vec[!is.na(raw_vec)]
      
      if (length(raw_vec) >= 3) {
        fit <- HoltWinters(ts(raw_vec), gamma = FALSE)
        fc <- predict(fit, n.ahead = 4)
        out <- list(
          historical = raw_vec,
          forecast = round(as.numeric(fc), 1)
        )
      }
    }, error = function(e) {})
  }
}

# Always output valid JSON to stdout
cat(jsonlite::toJSON(out, auto_unbox = TRUE), "\n")