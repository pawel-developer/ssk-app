-- =============================================================
-- Unify university names in profiles table
-- Run in Supabase Dashboard → SQL Editor
-- =============================================================

-- Poznań variants → canonical
UPDATE public.profiles SET university = 'Uniwersytet Medyczny im. Karola Marcinkowskiego w Poznaniu'
WHERE university IN (
  'Uniwersytet medyczny im. Karola Marcinkowskiego w Poznaniu',
  'Uniwersytet medyczny im Karola Marcinkowskiego w Poznaniu',
  'Uniewesytet Medyczny w Poznaniu',
  'Uniwersytet Medyczny w Poznaniu',
  'Uniwersytet Medyczny w Poznaniu UMP'
);

-- Gdańsk — lowercase typo
UPDATE public.profiles SET university = 'Gdański Uniwersytet Medyczny'
WHERE university = 'Gdański uniwersytet Medyczny';

-- WUM — department/hospital prefixes
UPDATE public.profiles SET university = 'Warszawski Uniwersytet Medyczny'
WHERE university IN (
  'UCK WUM, Warszawski Uniwersytet Medyczny',
  'I Katedra i Klinika Kardiologii WUM'
);

-- UMK Toruń/Bydgoszcz
UPDATE public.profiles SET university = 'Collegium Medicum Uniwersytetu Mikołaja Kopernika w Toruniu'
WHERE university IN (
  'CM UMK w Bydgoszczy',
  'Collegium Medicum Uniwersytet Mikołaja Kopernika w Toruniu'
);

-- Jagielloński
UPDATE public.profiles SET university = 'Collegium Medicum Uniwersytetu Jagiellońskiego'
WHERE university IN (
  'Uniwersytet Jagielloński',
  'Collegium Medicum UJ'
);

-- Wrocław — short form
UPDATE public.profiles SET university = 'Uniwersytet Medyczny im. Piastów Śląskich we Wrocławiu'
WHERE university = 'Uniwersytet Medyczny we Wrocławiu';

-- Łódź — alternative name
UPDATE public.profiles SET university = 'Uniwersytet Medyczny w Łodzi'
WHERE university = 'Łódzki Uniwersytet Medyczny';

-- Śląski — campus/hospital variants
UPDATE public.profiles SET university = 'Śląski Uniwersytet Medyczny w Katowicach'
WHERE university IN (
  'Śląski Uniwersytet Medyczny (Zabrze)',
  'Górnośląskie Centrum Medyczne im. prof. Leszka Gieca, ŚUM Katowice'
);

-- Zielona Góra — typo + short form
UPDATE public.profiles SET university = 'Collegium Medicum Uniwersytetu Zielonogórskiego'
WHERE university IN (
  'Collegium Medicum Uniwesytetu Zielonogórskiego',
  'Uniwersytet Zielonogórski'
);

-- Kraków AFM — old name
UPDATE public.profiles SET university = 'Krakowska Akademia im. Andrzeja Frycza Modrzewskiego'
WHERE university = 'Uniwersytet Andrzeja Frycza Modrzewskiego w Krakowie';

-- Kielce — abbreviation
UPDATE public.profiles SET university = 'Collegium Medicum Uniwersytetu Jana Kochanowskiego w Kielcach'
WHERE university = 'Collegium Medicum - UJK Kielce';

-- Verify: list all distinct university names after cleanup
SELECT university, COUNT(*) AS cnt
FROM public.profiles
WHERE university IS NOT NULL AND university != ''
GROUP BY university
ORDER BY cnt DESC;
