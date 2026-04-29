CREATE OR REPLACE FUNCTION save_site_settings(
  settings_payload JSONB,
  featured_project_ids UUID[]
)
RETURNS VOID AS $$
DECLARE
  setting_key TEXT;
  setting_value JSONB;
BEGIN
  FOR setting_key, setting_value IN SELECT * FROM jsonb_each(settings_payload)
  LOOP
    INSERT INTO site_settings (key, value, updated_at)
    VALUES (setting_key, setting_value #>> '{}', NOW())
    ON CONFLICT (key)
    DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
  END LOOP;

  UPDATE projects
  SET is_featured = FALSE
  WHERE is_featured = TRUE
    AND NOT (id = ANY(COALESCE(featured_project_ids, ARRAY[]::UUID[])));

  UPDATE projects
  SET is_featured = TRUE
  WHERE id = ANY(COALESCE(featured_project_ids, ARRAY[]::UUID[]))
    AND is_published = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
