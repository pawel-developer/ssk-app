-- SSK Site Content CMS Migration
-- Run this in Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- PREREQUISITE: Run fix-rls-v3.sql first (needs the is_admin() function)

-- ═══════════════════════════════════════════════════════════
-- 1. SITE_CONTENT TABLE
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.site_content (
  id text PRIMARY KEY,
  content jsonb NOT NULL,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous visitors) can read
CREATE POLICY "site_content_select"
  ON public.site_content FOR SELECT
  USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "site_content_admin_insert"
  ON public.site_content FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "site_content_admin_update"
  ON public.site_content FOR UPDATE
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "site_content_admin_delete"
  ON public.site_content FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_site_content_updated()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_site_content_updated
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.handle_site_content_updated();

-- ═══════════════════════════════════════════════════════════
-- 2. SEED: TEAM DATA
-- ═══════════════════════════════════════════════════════════

INSERT INTO public.site_content (id, content) VALUES
('team_board', '[
  {"name":"Adrian Bednarek","role_pl":"Prezes Zarządu Głównego","role_en":"President","img":"team-adrian"},
  {"name":"lek. Paweł Siuciak","role_pl":"Zastępca Prezesa","role_en":"Vice President","img":"team-pawel"},
  {"name":"lek. Marta Mazur","role_pl":"Sekretarz","role_en":"Secretary","img":"team-marta-m"},
  {"name":"lek. Marta Chamera","role_pl":"Skarbnik","role_en":"Treasurer","img":"team-marta-c"},
  {"name":"lek. Patryk Pindlowski","role_pl":"Członek Zarządu","role_en":"Board Member","img":"team-patryk"},
  {"name":"Emil Brociek","role_pl":"Członek Zarządu","role_en":"Board Member","img":"team-emil"},
  {"name":"Aniela Zaboklicka","role_pl":"Członek Zarządu","role_en":"Board Member","img":"team-aniela"},
  {"name":"Natan Adamów","role_pl":"Członek Zarządu","role_en":"Board Member","img":"team-natan"}
]'::jsonb),
('team_audit', '[
  {"name":"lek. Alicja Skrobucha","role_pl":"Przewodnicząca Komisji Rewizyjnej","role_en":"Chair of Audit Committee","img":"team-alicja"},
  {"name":"lek. Olga Wiśniewska","role_pl":"Członek Komisji Rewizyjnej","role_en":"Audit Committee Member","img":"team-olga"},
  {"name":"lek. Magdalena Synak","role_pl":"Członek Komisji Rewizyjnej","role_en":"Audit Committee Member","img":"team-magdalena"}
]'::jsonb),
('team_advisors', '[
  {"name":"Prof. Miłosz Jaguszewski","img":"advisor-jaguszewski"},
  {"name":"Prof. Mariusz Tomaniak","img":"advisor-tomaniak"},
  {"name":"Prof. Paweł Balsam","img":"advisor-balsam"},
  {"name":"Prof. Piotr Buszman","img":"advisor-buszman"},
  {"name":"Prof. Paweł Gąsior","img":"advisor-gasior"},
  {"name":"Prof. Marcin Grabowski","img":"advisor-grabowski"}
]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════
-- 3. SEED: HERO SECTION
-- ═══════════════════════════════════════════════════════════

INSERT INTO public.site_content (id, content) VALUES
('page_hero', '{
  "title_line1_pl":"Studenckie","title_line1_en":"Student",
  "title_line2_pl":"Stowarzyszenie","title_line2_en":"Cardiology",
  "title_line3_pl":"Kardiologiczne","title_line3_en":"Association",
  "subtitle_pl":"Łączymy studentów wszystkich kierunków medycznych i ścisłych, połączonych wspólną pasją do kardiologii. Zrzeszamy osoby do 3 lat od ukończenia studiów.",
  "subtitle_en":"We unite students of all medical and science fields, connected by a shared passion for cardiology. Open to graduates up to 3 years after completing their studies.",
  "btn1_pl":"Dołącz do nas","btn1_en":"Join Us",
  "btn2_pl":"Dowiedz się więcej","btn2_en":"Learn more",
  "stat1_number":"200+","stat1_pl":"Członków","stat1_en":"Members",
  "stat2_number":"15+","stat2_pl":"Uczelni medycznych","stat2_en":"Medical universities"
}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════
-- 4. SEED: ABOUT SECTION
-- ═══════════════════════════════════════════════════════════

INSERT INTO public.site_content (id, content) VALUES
('page_about', '{
  "tag_pl":"Kim jesteśmy","tag_en":"Who we are",
  "title_pl":"Więcej niż koło naukowe","title_en":"More than a student club",
  "desc_pl":"SSK to ogólnopolska sieć studentów, którzy nie czekają na dyplom, żeby zacząć robić rzeczy w kardiologii. Organizujemy to, czego brakuje na uczelniach — praktyczne warsztaty, dostęp do ekspertów i środowisko ludzi, którzy chcą więcej.",
  "desc_en":"SSK is a nationwide network of students who don''t wait for a diploma to get involved in cardiology. We organize what universities lack — hands-on workshops, access to experts, and a community of people who want more.",
  "cards":[
    {"icon":"🫀","title_pl":"Ręce na ECHO i EKG","title_en":"Hands on ECHO & ECG","desc_pl":"Nie tylko teoria. Warsztaty echokardiografii, EKG, symulacje medyczne, cewnikowanie — uczysz się na sprzęcie, nie ze slajdów.","desc_en":"Not just theory. Echocardiography workshops, ECG, medical simulations, catheterization — you learn on real equipment, not from slides."},
    {"icon":"🌍","title_pl":"Sieć z 15+ uczelni","title_en":"Network from 15+ universities","desc_pl":"Studenci z WUM, GUMed, UJ, UM Wrocław i wielu innych. Szkoły letnie w Gdańsku, konferencje w Warszawie, spotkania online z całej Polski.","desc_en":"Students from WUM, GUMed, UJ, UM Wrocław and many more. Summer schools in Gdańsk, conferences in Warsaw, online meetings from across Poland."},
    {"icon":"🎓","title_pl":"Eksperci jako mentorzy","title_en":"Experts as mentors","desc_pl":"Prof. Jaguszewski, prof. Balsam, prof. Buszman i inni — nasi opiekunowie merytoryczni to liderzy polskiej kardiologii, którzy prowadzą wykłady i warsztaty specjalnie dla nas.","desc_en":"Prof. Jaguszewski, Prof. Balsam, Prof. Buszman and others — our academic advisors are leaders of Polish cardiology who give lectures and workshops exclusively for us."}
  ]
}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════
-- 5. SEED: JOIN SECTION
-- ═══════════════════════════════════════════════════════════

INSERT INTO public.site_content (id, content) VALUES
('page_join', '{
  "tag_pl":"Członkostwo","tag_en":"Membership",
  "title_pl":"Dołącz do nas","title_en":"Join Us",
  "form_url":"/join",
  "step1_title_pl":"Wypełnij formularz","step1_title_en":"Fill out the form",
  "step1_desc_pl":"Kliknij poniższy przycisk i wypełnij formularz zgłoszeniowy — zajmie to tylko kilka minut.",
  "step1_desc_en":"Click the button below and fill out the application form — it only takes a few minutes.",
  "step1_btn_pl":"Otwórz formularz","step1_btn_en":"Open form",
  "step2_title_pl":"Opłać składkę","step2_title_en":"Pay membership fee",
  "step2_desc_pl":"Składka członkowska wynosi 50 zł rocznie.","step2_desc_en":"The annual membership fee is 50 PLN.",
  "account_number":"43 1600 1462 1710 3081 5000 0001",
  "recipient":"Studenckie Stowarzyszenie Kardiologiczne",
  "recipient_address":"ul. 1 Maja 6/61, 02-495 Warszawa",
  "fee_title_pl":"Składka członkowska Imię Nazwisko Uczelnia","fee_title_en":"Membership fee First-Name Last-Name University",
  "step3_title_pl":"Czekaj na potwierdzenie","step3_title_en":"Wait for confirmation",
  "step3_desc_pl":"Po zaksięgowaniu wpłaty i weryfikacji formularza otrzymasz potwierdzenie członkostwa. Jeśli masz pytania, napisz do nas:","step3_desc_en":"After the payment is registered and your form is verified, you will receive membership confirmation. If you have questions, contact us:",
  "contact_email":"studenckiestowarzyszeniekardio@gmail.com",
  "info_pl":"Jeśli nie otrzymasz potwierdzenia w ciągu kilku dni, sprawdź folder spam lub napisz do nas na powyższy adres e-mail.",
  "info_en":"If you don''t receive confirmation within a few days, check your spam folder or email us at the address above."
}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════
-- 6. SEED: COOPERATION SECTION
-- ═══════════════════════════════════════════════════════════

INSERT INTO public.site_content (id, content) VALUES
('page_cooperation', '{
  "title_pl":"Współpraca z SKN","title_en":"Cooperation with Student Scientific Circles",
  "desc_pl":"Studenckie Koła Naukowe mogą nawiązać z nami współpracę. Wypełnij formularze partnerskie i wyślij na nasz adres e-mail. Propozycja zostanie rozpatrzona na najbliższym posiedzeniu Zarządu Głównego.",
  "desc_en":"Student Scientific Circles can partner with us. Fill out the partnership forms and send them to our email. The proposal will be reviewed at the next Main Board meeting.",
  "btn_pl":"Skontaktuj się","btn_en":"Get in touch",
  "email":"studenckiestowarzyszeniekardio@gmail.com"
}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════
-- 7. SEED: FAQ
-- ═══════════════════════════════════════════════════════════

INSERT INTO public.site_content (id, content) VALUES
('faq', '[
  {"questionPl":"Dlaczego stowarzyszenie, a nie koło naukowe?","questionEn":"Why an association and not a scientific circle?","answerPl":"Stowarzyszenie daje nam niezależność prawną i możliwość działania międzyuczelnianego. Jako zarejestrowany podmiot w KRS, możemy formalnie współpracować z ośrodkami akademickimi, pozyskiwać sponsorów i organizować ogólnopolskie wydarzenia.","answerEn":"An association gives us legal independence and the ability to operate across universities. As a registered entity in the National Court Register (KRS), we can formally collaborate with academic centers, attract sponsors, and organize nationwide events."},
  {"questionPl":"Kto może dołączyć do SSK?","questionEn":"Who can join SSK?","answerPl":"Studenci wszystkich kierunków medycznych i ścisłych oraz osoby do 3 lat od ukończenia studiów. Nie musisz studiować medycyny — wystarczy pasja do kardiologii!","answerEn":"Students of all medical and science fields, and graduates up to 3 years after completing their studies. You don''t have to study medicine — a passion for cardiology is enough!"},
  {"questionPl":"Ile kosztuje członkostwo?","questionEn":"How much does membership cost?","answerPl":"Roczna składka członkowska wynosi 50 zł. Zapewnia ona dostęp do wszystkich wydarzeń, warsztatów i materiałów edukacyjnych.","answerEn":"The annual membership fee is 50 PLN. It provides access to all events, workshops, and educational materials."},
  {"questionPl":"Jak wygląda współpraca z kołami naukowymi?","questionEn":"How does cooperation with scientific circles work?","answerPl":"SKN mogą nawiązać formalną współpracę poprzez wypełnienie formularzy partnerskich i przesłanie ich na nasz adres e-mail. Każda propozycja jest rozpatrywana na posiedzeniu Zarządu Głównego.","answerEn":"Student Scientific Circles can establish formal cooperation by filling out partnership forms and sending them to our email. Each proposal is reviewed at a Main Board meeting."},
  {"questionPl":"Czy SSK działa tylko w Warszawie?","questionEn":"Does SSK only operate in Warsaw?","answerPl":"Nie — SSK zrzesza studentów z ponad 15 uczelni medycznych z całej Polski. Spotkania online organizujemy regularnie, a warsztaty stacjonarne odbywają się w różnych miastach — m.in. Warszawie, Gdańsku i Wrocławiu.","answerEn":"No — SSK brings together students from over 15 medical universities across Poland. We organize regular online meetings, and in-person workshops take place in various cities — including Warsaw, Gdańsk, and Wrocław."},
  {"questionPl":"Jak często odbywają się wydarzenia?","questionEn":"How often do events take place?","answerPl":"Spotkania edukacyjne online organizujemy co miesiąc. Warsztaty praktyczne ECHO i EKG, szkoły letnie i konferencje — kilka razy w roku. Śledź nasz Facebook i Instagram, żeby nie przegapić terminów.","answerEn":"We hold educational online meetings monthly. Hands-on ECHO and ECG workshops, summer schools, and conferences take place several times a year. Follow our Facebook and Instagram to stay up to date."},
  {"questionPl":"Czy muszę studiować medycynę, żeby dołączyć?","questionEn":"Do I need to study medicine to join?","answerPl":"Nie. Zapraszamy studentów wszystkich kierunków medycznych i ścisłych — lekarskiego, pielęgniarstwa, fizjoterapii, biomedycyny, biotechnologii i wielu innych. Liczy się zainteresowanie kardiologią.","answerEn":"No. We welcome students from all medical and science fields — medicine, nursing, physiotherapy, biomedicine, biotechnology, and many more. What matters is your interest in cardiology."},
  {"questionPl":"Jak się zapisać?","questionEn":"How do I sign up?","answerPl":"Wypełnij formularz zgłoszeniowy online (link w sekcji „Dołącz do nas"), opłać składkę członkowską (50 zł/rok) i czekaj na potwierdzenie. Cały proces zajmuje kilka minut.","answerEn":"Fill out the online application form (link in the ''Join Us'' section), pay the membership fee (50 PLN/year), and wait for confirmation. The whole process takes just a few minutes."}
]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════
-- 8. SEED: EVENTS
-- ═══════════════════════════════════════════════════════════

INSERT INTO public.site_content (id, content) VALUES
('events_upcoming', '{
  "img":"/img/event1_wiosenna2-cover.webp",
  "title":"Wiosenna Szkoła Kardiologiczna — II Edycja",
  "date_pl":"8 marca 2026 · 8:30 · Centrum Symulacji WUM, Warszawa",
  "date_en":"March 8, 2026 · 8:30 AM · WUM Simulation Center, Warsaw",
  "desc_pl":"Całodniowe warsztaty umiejętności praktycznych. II edycja we współpracy ze SKN przy I Katedrze i Klinice Kardiologii WUM.",
  "desc_en":"Full-day hands-on skills workshops. 2nd edition in collaboration with the Student Scientific Circle at the 1st Department of Cardiology, WUM.",
  "badge_pl":"📅 Nadchodzące","badge_en":"📅 Upcoming",
  "link":"https://www.facebook.com/events/3237057496601991/",
  "btn_pl":"Zobacz na Facebooku","btn_en":"View on Facebook"
}'::jsonb),
('events_past', '[
  {"href":"https://www.facebook.com/events/1600367001002973/","img":"/img/event2_lipidy-cover.webp","alt":"Zaburzenia lipidowe 2026","date":"23.02.2026","titlePl":"Wytyczne diagnostyki zaburzeń lipidowych 2026","titleEn":"Lipid Disorder Diagnostic Guidelines 2026","metaPl":"Online · Prof. Maciej Banach","metaEn":"Online · Prof. Maciej Banach"},
  {"href":"https://www.facebook.com/events/1180004167648593/","img":"/img/event3_zastawka-cover.webp","alt":"Zastawka aortalna","date":"27.01.2026","titlePl":"Zastawka aortalna — diagnostyka i leczenie zabiegowe","titleEn":"Aortic Valve — Diagnostics & Interventional Treatment","metaPl":"Online","metaEn":"Online"},
  {"href":"https://www.facebook.com/events/1776803796342665","img":"/img/event-1776803796342665.webp","alt":"Warsztaty Kardiologii Interwencyjnej","date":"24.01.2026","titlePl":"Warsztaty Kardiologii Interwencyjnej","titleEn":"Interventional Cardiology Workshops","metaPl":"Gdańsk · SKN Hemodynamiki GUMed","metaEn":"Gdańsk · SKN Hemodynamiki GUMed"},
  {"href":"https://www.facebook.com/events/2385544128564083","img":"/img/event-2385544128564083.webp","alt":"Amyloidoza serca","date":"08.12.2025","titlePl":"Amyloidoza serca — cichy kameleon w kardiologii","titleEn":"Cardiac Amyloidosis — The Silent Chameleon","metaPl":"Online · Prof. Alicja Dąbrowska-Kugacka","metaEn":"Online · Prof. Alicja Dąbrowska-Kugacka"},
  {"href":"https://www.facebook.com/events/1842680213344407/","img":"/img/event4_warsztaty-cover.webp","alt":"Pacjent-lek-zespół","date":"11.10.2025","titlePl":"Pacjent — lek — zespół: wyzwania opieki kardiologicznej","titleEn":"Patient — Drug — Team: Cardiology Care Challenges","metaPl":"Warszawa · Warsztaty stacjonarne","metaEn":"Warsaw · In-person workshops"},
  {"href":"https://www.facebook.com/events/2129639964128688","img":"/img/event-2129639964128688.webp","alt":"II Edycja Kardiologicznej Szkoły Letniej","date":"08–12.08.2025","titlePl":"II Edycja Kardiologicznej Szkoły Letniej","titleEn":"2nd Cardiology Summer School","metaPl":"Gdańsk · SKN Hemodynamiki GUMed","metaEn":"Gdańsk · SKN Hemodynamiki GUMed"},
  {"href":"https://www.facebook.com/events/1607813013172743","img":"/img/event-1607813013172743.webp","alt":"Wiosenna Szkoła Kardiologiczna I","date":"16.03.2025","titlePl":"Wiosenna Szkoła Kardiologiczna — I Edycja","titleEn":"Spring Cardiology School — 1st Edition","metaPl":"Warszawa · Centrum Symulacji WUM","metaEn":"Warsaw · WUM Simulation Center"}
]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════
-- DONE! All landing page content is now in site_content.
-- Admins can edit it from the admin panel.
-- ═══════════════════════════════════════════════════════════
