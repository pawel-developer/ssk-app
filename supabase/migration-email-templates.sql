-- Migration: seed editable templates for automatic emails
-- Run in Supabase Dashboard -> SQL Editor

INSERT INTO public.site_content (id, content)
VALUES (
  'email_templates',
  '{
  "welcome": {
    "subject": "🫀 Witamy w Studenckim Stowarzyszeniu Kardiologicznym",
    "body": "Cześć {{firstName}},\n\nDziękujemy za rejestrację w Studenckim Stowarzyszeniu Kardiologicznym.\nTwoje konto zostało pomyślnie utworzone i możesz już zalogować się do panelu członka.\n\nCieszymy się, że jesteś z nami 🫀\n\nPozdrawiamy,\nZespół SSK"
  },
  "payment_confirmed": {
    "subject": "🫀 Potwierdzenie opłacenia składki członkowskiej",
    "body": "Cześć {{firstName}},\n\nPotwierdziliśmy otrzymanie Twojej składki członkowskiej.\nTwoje członkostwo jest aktywne do: {{feeValidUntil}}.\n\nDziękujemy za dopełnienie formalności.\n\nPozdrawiamy,\nZespół SSK"
  },
  "payment_rejected": {
    "subject": "🫀 Prośba o ponowne przesłanie potwierdzenia płatności",
    "body": "Cześć {{firstName}},\n\nNie udało się zweryfikować przesłanego potwierdzenia płatności.\n{{reasonLine}}\n\nProsimy o przesłanie nowego potwierdzenia w panelu członka.\n\nPozdrawiamy,\nZespół SSK"
  },
  "payment_reminder": {
    "subject": "🫀 Przypomnienie o składce członkowskiej",
    "body": "Cześć {{firstName}},\n\nPrzypominamy o konieczności opłacenia składki członkowskiej Studenckiego Stowarzyszenia Kardiologicznego.\n{{feeValidUntilLine}}\n\nJak opłacić składkę przez panel członka:\n1) Zaloguj się do panelu członka.\n2) Przejdź do zakładki: Płatności.\n3) Wykonaj przelew na numer konta widoczny w panelu.\n4) Wgraj potwierdzenie przelewu (JPG/PNG/PDF) i kliknij \"Wyślij potwierdzenie\".\n\nPo weryfikacji przez zarząd status składki zostanie zaktualizowany.\n\nDziękujemy i zachęcamy do pozostania aktywną częścią SSK 🫀\n\nPozdrawiamy,\nZespół SSK"
  },
  "birthday": {
    "subject": "🎉 Najlepsze życzenia urodzinowe od SSK 🫀",
    "body": "Cześć {{firstName}},\n\nZ okazji Twoich urodzin składamy Ci najserdeczniejsze życzenia: dużo zdrowia, sukcesów oraz satysfakcji z rozwoju naukowego i działalności w kardiologii.\n\nWszystkiego najlepszego! 🎉\n\nPozdrawiamy,\nZespół SSK"
  },
  "event_announcement": {
    "subject": "🫀 Zaproszenie na wydarzenie SSK: {{eventTitle}}",
    "body": "Cześć {{firstName}},\n\nMamy przyjemność zaprosić Cię na wydarzenie organizowane przez Studenckie Stowarzyszenie Kardiologiczne: {{eventTitle}}.\n{{eventEmailDescriptionLine}}\n\nWięcej informacji znajdziesz tutaj: {{eventFbUrl}}\n\nMamy nadzieję, że dołączysz do nas!\n\nPozdrawiamy,\nZespół SSK"
  },
  "event_meeting_link": {
    "subject": "🫀 Link do spotkania: {{eventTitle}}",
    "body": "Cześć {{firstName}},\n\nPrzesyłamy link do spotkania dotyczącego wydarzenia: {{eventTitle}}.\n\nLink do spotkania: {{eventMeetingLink}}\n\nDo zobaczenia!\n\nPozdrawiamy,\nZespół SSK"
  }
}'::jsonb
)
ON CONFLICT (id) DO UPDATE
SET content = EXCLUDED.content;
