-- ============================================================
-- ZoneGuard Analytics Views
-- Run this file once against your local Postgres database
-- (zoneguard_db) after pulling, before using the Map features
-- (Complaint Density / Complaint Status) in the admin dashboard.
--
-- How to run:
--   pgAdmin: open Query Tool on zoneguard_db, paste this whole
--            file, and execute (F5).
--   psql:    psql -d zoneguard_db -f backend/sql/views.sql
-- ============================================================


-- ------------------------------------------------------------
-- 1. complaint_lot_map
-- Resolves which lot a given complaint ticket belongs to.
-- Tenants link directly via tenants.lot_id.
-- Homeowners link via homeowners.homeowner_id -> lots.homeowner_id,
-- preferring the lot flagged is_primary_lot = TRUE, falling back
-- to any lot owned by that homeowner if none is flagged primary.
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW complaint_lot_map AS
WITH via_tenant AS (
  SELECT c.ticket_id, t.lot_id
  FROM complaints c
  JOIN tenants t ON t.user_id = c.user_id
),
via_owner AS (
  SELECT c.ticket_id,
    COALESCE(
      (SELECT l.lot_id FROM lots l WHERE l.homeowner_id = h.homeowner_id AND l.is_primary_lot = TRUE LIMIT 1),
      (SELECT l.lot_id FROM lots l WHERE l.homeowner_id = h.homeowner_id LIMIT 1)
    ) AS lot_id
  FROM complaints c
  JOIN homeowners h ON h.user_id = c.user_id
  WHERE NOT EXISTS (SELECT 1 FROM via_tenant vt WHERE vt.ticket_id = c.ticket_id)
)
SELECT * FROM via_tenant
UNION ALL
SELECT * FROM via_owner;


-- ------------------------------------------------------------
-- 2. complaint_density_by_lot
-- Complaint counts per lot, used by the Complaint Density
-- (heatmap / choropleth) view on the admin map.
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW complaint_density_by_lot AS
SELECT l.lot_id, l.longitude, l.latitude, l.zone_id,
       COUNT(clm.ticket_id) AS complaint_count
FROM lots l
LEFT JOIN complaint_lot_map clm ON clm.lot_id = l.lot_id
GROUP BY l.lot_id, l.longitude, l.latitude, l.zone_id;


-- ------------------------------------------------------------
-- 3. complaint_status_by_lot
-- Full complaint history per lot as a JSON array, ordered by
-- status priority (Active > Pending > Escalated > Investigating
-- > Resolved) then most recent first. Used by the Complaint
-- Status view on the admin map, including multi-complaint lots.
--
-- NOTE: uses DROP + CREATE (not CREATE OR REPLACE) because this
-- view's column list differs from earlier iterations built
-- during development; Postgres won't let CREATE OR REPLACE
-- change a view's columns.
-- ------------------------------------------------------------
DROP VIEW IF EXISTS complaint_status_by_lot;

CREATE VIEW complaint_status_by_lot AS
WITH ranked_complaints AS (
  SELECT
    clm.lot_id,
    c.ticket_id,
    c.complaint_status,
    c.complaint_category,
    c.created_at,
    CONCAT(u.first_name, ' ', u.last_name) AS uploaded_by,
    CASE c.complaint_status::text
      WHEN 'ACTIVE'        THEN 1
      WHEN 'PENDING'       THEN 2
      WHEN 'ESCALATED'     THEN 3
      WHEN 'INVESTIGATING' THEN 4
      WHEN 'RESOLVED'      THEN 5
      ELSE 6
    END AS status_rank
  FROM complaint_lot_map clm
  JOIN complaints c ON c.ticket_id = clm.ticket_id
  JOIN users u ON u.user_id = c.user_id
),
lot_complaints AS (
  SELECT
    lot_id,
    json_agg(
      json_build_object(
        'ticket_id', ticket_id,
        'status', complaint_status,
        'category', complaint_category,
        'date_filed', created_at,
        'uploaded_by', uploaded_by
      )
      ORDER BY status_rank ASC, created_at DESC
    ) AS all_complaints,
    COUNT(*) AS complaint_count
  FROM ranked_complaints
  GROUP BY lot_id
)
SELECT
  l.lot_id, l.longitude, l.latitude, l.zone_id,
  lc.all_complaints,
  COALESCE(lc.complaint_count, 0) AS complaint_count
FROM lots l
LEFT JOIN lot_complaints lc ON lc.lot_id = l.lot_id;