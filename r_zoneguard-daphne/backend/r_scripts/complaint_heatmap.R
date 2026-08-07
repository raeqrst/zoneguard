suppressMessages({
  library(DBI)
  library(RPostgres)
  library(sf)
  library(dplyr)
  library(geojsonio)
  library(dotenv)
})

# Load .env when running standalone (harmless if DATABASE_URL is already set by Node)
if (Sys.getenv("DATABASE_URL") == "") {
  load_dot_env(file = ".env")  # assumes script is run from backend/, same as before
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

# --- Pull aggregated complaint counts per lot (the view from pgAdmin) ---
density <- dbGetQuery(con, "SELECT * FROM complaint_density_by_lot")

# --- Join onto your QGIS-exported polygons ---
lots <- st_read("datasets/zone3_lots.geojson", quiet = TRUE)

# Clean up whitespace/newlines from QGIS attribute table entries so joins don't silently fail
lots$lot_id <- trimws(lots$lot_id)
density$lot_id <- trimws(density$lot_id)

lots <- lots %>% left_join(density, by = "lot_id")
lots$complaint_count[is.na(lots$complaint_count)] <- 0

lots$density_class <- dplyr::case_when(
  lots$complaint_count == 0 ~ 1,
  lots$complaint_count == 1 ~ 2,
  lots$complaint_count == 2 ~ 3,
  lots$complaint_count == 3 ~ 4,
  lots$complaint_count >= 4 ~ 5
)

cat(geojson_json(lots))