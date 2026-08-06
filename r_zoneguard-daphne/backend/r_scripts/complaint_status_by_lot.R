suppressMessages({
  library(DBI)
  library(RPostgres)
  library(sf)
  library(dplyr)
  library(geojsonio)
  library(dotenv)
})

if (Sys.getenv("DATABASE_URL") == "") {
  load_dot_env(file = ".env")
}

db_url <- Sys.getenv("DATABASE_URL")
parsed <- regmatches(db_url, regexec(
  "postgres(?:ql)?://([^:]+):([^@]+)@([^:/]+):?(\\d*)/([^?]+)", db_url
))[[1]]

con <- dbConnect(
  RPostgres::Postgres(),
  user = parsed[2], password = parsed[3], host = parsed[4],
  port = ifelse(parsed[5] == "", 5432, as.integer(parsed[5])),
  dbname = parsed[6]
)
on.exit(dbDisconnect(con))

status_data <- dbGetQuery(con, "SELECT * FROM complaint_status_by_lot")

lots <- st_read("datasets/zone3_lots.geojson", quiet = TRUE)
lots$lot_id <- trimws(lots$lot_id)
status_data$lot_id <- trimws(status_data$lot_id)

lots <- lots %>% left_join(status_data, by = "lot_id")
lots$complaint_count[is.na(lots$complaint_count)] <- 0
lots$has_multiple <- lots$complaint_count > 1

cat(geojson_json(lots))