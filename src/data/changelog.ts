export interface ChangelogSection {
  area: "landing" | "panel" | "admin";
  items: { pl: string; en: string }[];
}

export interface ChangelogEntry {
  date: string;
  titlePl: string;
  titleEn: string;
  sections: ChangelogSection[];
}

const AREA_LABELS = {
  landing: { pl: "Strona g\u0142\u00f3wna", en: "Public landing page" },
  panel: { pl: "Panel cz\u0142onka", en: "Member panel" },
  admin: { pl: "Panel admina", en: "Admin panel" },
} as const;

export { AREA_LABELS };

export const changelog: ChangelogEntry[] = [
  {
    date: "2026-05-23",
    titlePl: "Moduł edukacyjny",
    titleEn: "Education module",
    sections: [
      {
        area: "admin",
        items: [
          {
            pl: 'Nowa zakładka "Materiały edukacyjne" w panelu admina — zarządzanie treściami w 3-poziomowej hierarchii: kategorie → podkategorie → materiały z klipami YouTube. Pełny CRUD z przełącznikiem publikacji na każdym poziomie.',
            en: 'New "Materiały edukacyjne" tab in the admin panel — manage content in a 3-level hierarchy: categories → subcategories → materials with YouTube clips. Full CRUD with publish toggle at every level.',
          },
          {
            pl: "Edytor materiałów — formularz z tytułem, opisem, autorem, tagami, notatkami (do przypadków klinicznych) i wieloma klipami YouTube. Automatyczne parsowanie URL-i YouTube i podgląd miniatur.",
            en: "Material editor — form with title, description, author, tags, notes (for clinical cases), and multiple YouTube clips. Automatic YouTube URL parsing and thumbnail preview.",
          },
          {
            pl: "Nawigacja breadcrumb w edytorze — drill-down UI z widokiem kategorii, podkategorii i materiałów. Liczniki podkategorii i materiałów na kartach, statusy publikacji.",
            en: "Breadcrumb navigation in the editor — drill-down UI with category, subcategory, and material views. Subcategory and material counts on cards, publication status badges.",
          },
        ],
      },
      {
        area: "panel",
        items: [
          {
            pl: "Biblioteka edukacyjna (/panel/education) — przeglądanie materiałów z poziomymi karuzelami. Widok kategorii, podkategorii i szczegółów materiału z osadzonym odtwarzaczem YouTube.",
            en: "Education library (/panel/education) — content browsing with horizontal carousels. Category, subcategory, and material detail views with embedded YouTube player.",
          },
          {
            pl: "Widok materiału — odtwarzacz YouTube, selektor klipów dla materiałów wieloodcinkowych, informacje o autorze, tagi i boczny panel z notatkami do przypadków klinicznych.",
            en: "Material detail view — YouTube player, clip selector for multi-episode materials, author info, tags, and a side panel with clinical case notes.",
          },
          {
            pl: "Widget edukacyjny na dashboardzie (/panel) — karta z podglądem do 4 kategorii z miniaturami i liczbą materiałów, z linkiem do pełnej biblioteki.",
            en: "Education widget on the dashboard (/panel) — card showing up to 4 categories with thumbnails and material counts, linking to the full library.",
          },
        ],
      },
    ],
  },
  {
    date: "2026-05-23",
    titlePl: "Przebudowa edytora wydarzeń",
    titleEn: "Events editor overhaul",
    sections: [
      {
        area: "admin",
        items: [
          {
            pl: "Integracja z Google Calendar i Meet — tworzenie wydarzeń w kalendarzu Google z poziomu panelu admina. Dla spotkań online automatyczne generowanie linku Google Meet, dla stacjonarnych — wydarzenie z lokalizacją bez Meet.",
            en: "Google Calendar & Meet integration — create Google Calendar events from the admin panel. Online meetings get an auto-generated Google Meet link; onsite events include location without Meet.",
          },
          {
            pl: "Tryb wydarzenia online/stacjonarnie — nowy przełącznik trybu wydarzenia. Spotkania online wyświetlają link do spotkania, stacjonarne — miejsce.",
            en: "Online/onsite event mode — new event mode toggle. Online meetings show a meeting link, onsite events show a location.",
          },
          {
            pl: "Strukturalne pola dat — zastąpienie tekstowego pola daty selektorami daty (Od–Do) i godziny (00/15/30/45). Automatyczne uzupełnianie godziny zakończenia (start + 1h). Opcjonalne pole miejsca i prowadzącego/organizatora.",
            en: "Structured date fields — replaced the text date field with date pickers (From–To) and time selectors (00/15/30/45). Auto-fill end time (start + 1h). Optional place and organizer fields.",
          },
          {
            pl: "Automatyczne przenoszenie przeszłych wydarzeń — po załadowaniu panelu admina, wydarzenia z datą w przeszłości są automatycznie przenoszone do sekcji przeszłych.",
            en: "Auto-expire events — on admin panel load, events with past dates are automatically moved to the past events section.",
          },
          {
            pl: "Klikalne miniaturki wydarzeń — podgląd zdjęcia w modalu z opcjami przycinania, zmiany obrazu i zamknięcia. Większe miniaturki na kartach wydarzeń.",
            en: "Clickable event thumbnails — image preview modal with crop, change image, and close options. Larger thumbnails on event cards.",
          },
          {
            pl: "Pełna parzystość przeszłych wydarzeń — przeszłe wydarzenia mają teraz te same pola co nadchodzące: tryb online/stacjonarnie, zakres dat Od–Do, link do Facebooka, opis PL/EN i prowadzący.",
            en: "Full past events parity — past events now have the same fields as upcoming: online/onsite mode, date range From–To, Facebook link, PL/EN description, and organizer.",
          },
        ],
      },
    ],
  },
  {
    date: "2026-05-23",
    titlePl: "Nowy dashboard panelu członka",
    titleEn: "Member panel dashboard",
    sections: [
      {
        area: "panel",
        items: [
          {
            pl: 'Nowy dashboard z powitaniem — po zalogowaniu członek widzi "Witaj w SSK, {imię}!" i trzy karty: status członkostwa, nadchodzące wydarzenia i podgląd materiałów edukacyjnych.',
            en: 'New welcome dashboard — after login, the member sees "Witaj w SSK, {name}!" and three cards: membership status, upcoming events, and education preview.',
          },
          {
            pl: "Changelog dla członków (/panel/changelog) — historia zmian w formacie timeline, widoczne tylko zmiany dotyczące panelu członka i strony głównej (bez wewnętrznych zmian admina).",
            en: "Member changelog (/panel/changelog) — change history in timeline format, showing only member panel and landing page changes (no internal admin changes).",
          },
          {
            pl: 'Karta "Co nowego?" na dashboardzie — wyświetla 3 najnowsze wpisy z changelogu z linkiem do pełnej historii zmian.',
            en: '"What\'s new?" dashboard card — shows 3 recent changelog entries with a link to the full change history.',
          },
        ],
      },
    ],
  },
  {
    date: "2026-05-23",
    titlePl: "Narzędzia administracyjne",
    titleEn: "Admin tools",
    sections: [
      {
        area: "admin",
        items: [
          {
            pl: 'Przycisk "Wyślij link do resetu hasła" na profilu członka — admin może wysłać link do resetowania hasła bezpośrednio z profilu członka w panelu admina. Przydatne gdy członek nie otrzymuje maili automatycznych.',
            en: '"Send password reset link" button on member profile — admin can send a password reset link directly from the member profile in the admin panel. Useful when automatic emails are not delivered.',
          },
          {
            pl: 'Nowa zakładka "Instrukcja" w panelu admina — rozwijany poradnik obsługi panelu w 4 sekcjach: podstawy (logowanie, publikacja), treści publiczne (wydarzenia, zarząd, treści strony), zarządzanie członkami (płatności, uprawnienia, rozwiązywanie problemów), zmiany w kodzie (architektura, Cursor, GitHub, Vercel, Supabase).',
            en: 'New "Instrukcja" (Guide) tab in the admin panel — collapsible admin guide in 4 sections: basics (login, publishing), public content (events, board, site content), member management (payments, permissions, troubleshooting), code changes (architecture, Cursor, GitHub, Vercel, Supabase).',
          },
        ],
      },
    ],
  },
  {
    date: "2026-05-23",
    titlePl: "Publiczny changelog",
    titleEn: "Public changelog",
    sections: [
      {
        area: "landing",
        items: [
          {
            pl: 'Nowa strona /changelog \u2014 przegl\u0105daj pe\u0142n\u0105 histori\u0119 zmian w formacie timeline z podzia\u0142em na obszary (strona, panel cz\u0142onka, panel admina). Dost\u0119pna publicznie, z prze\u0142\u0105cznikiem PL/EN.',
            en: "New /changelog page \u2014 browse the full change history in a timeline format, divided by area (landing, member panel, admin panel). Publicly accessible with PL/EN toggle.",
          },
        ],
      },
      {
        area: "admin",
        items: [
          {
            pl: 'Nowa zak\u0142adka "Changelog" w panelu admina \u2014 podgl\u0105d wszystkich wpis\u00f3w z linkiem do strony publicznej. Changelog jest aktualizowany automatycznie przy ka\u017cdej sesji pracy nad kodem.',
            en: 'New "Changelog" tab in the admin panel \u2014 view all entries with a link to the public page. The changelog is updated automatically with each coding session.',
          },
        ],
      },
    ],
  },
  {
    date: "2026-03-15",
    titlePl: "Zdj\u0119cia wydarze\u0144, e-maile i bezpiecze\u0144stwo",
    titleEn: "Event photos, emails & security",
    sections: [
      {
        area: "admin",
        items: [
          {
            pl: "Przesy\u0142anie zdj\u0119\u0107 do wydarze\u0144 \u2014 w edytorze wydarze\u0144 mo\u017cna teraz doda\u0107 zdj\u0119cie z dysku. Obraz jest automatycznie przesy\u0142any do Supabase Storage i wy\u015bwietlany na stronie g\u0142\u00f3wnej.",
            en: "Event photo uploads \u2014 the events editor now allows adding an image from disk. The image is automatically uploaded to Supabase Storage and displayed on the homepage.",
          },
          {
            pl: "Automatyczne \u017cyczenia urodzinowe \u2014 codziennie o 7:00 system sprawdza daty urodzenia cz\u0142onk\u00f3w i wysy\u0142a \u017cyczenia e-mailem (Vercel Cron + Brevo SMTP).",
            en: "Automatic birthday wishes \u2014 every day at 7:00 AM the system checks member birth dates and sends birthday emails (Vercel Cron + Brevo SMTP).",
          },
          {
            pl: "Poprawki szablon\u00f3w e-mail \u2014 naprawiono problem z dostarczaniem maili na produkcji, szablony teraz poprawnie renderuj\u0105 imi\u0119 cz\u0142onka i dane sk\u0142adki.",
            en: "Email template fixes \u2014 fixed email delivery issues on production, templates now correctly render member name and fee data.",
          },
        ],
      },
      {
        area: "panel",
        items: [
          {
            pl: 'Odzyskiwanie has\u0142a \u2014 nowy przycisk "Nie pami\u0119tam has\u0142a" na stronie logowania. System wysy\u0142a link do resetowania has\u0142a na e-mail cz\u0142onka.',
            en: 'Password recovery \u2014 new "Forgot password" button on the login page. The system sends a password reset link to the member\'s email.',
          },
          {
            pl: "Strona resetowania has\u0142a \u2014 po klikni\u0119ciu linku z e-maila cz\u0142onek mo\u017ce ustawi\u0107 nowe has\u0142o przez formularz na stronie /reset-password.",
            en: "Password reset page \u2014 after clicking the link from the email, the member can set a new password via the form at /reset-password.",
          },
        ],
      },
    ],
  },
  {
    date: "2026-03-15",
    titlePl: "Du\u017ca aktualizacja paneli",
    titleEn: "Major panel update",
    sections: [
      {
        area: "admin",
        items: [
          {
            pl: "Profil cz\u0142onka (/admin/member/[id]) \u2014 kliknij na cz\u0142onka w tabeli, by zobaczy\u0107 pe\u0142ny profil z danymi osobowymi, histori\u0105 p\u0142atno\u015bci, dat\u0105 do\u0142\u0105czenia i statusem sk\u0142adki. Mo\u017cna edytowa\u0107 wybrane pola.",
            en: "Member profile (/admin/member/[id]) \u2014 click a member in the table to see their full profile with personal data, payment history, join date, and fee status. Selected fields can be edited.",
          },
          {
            pl: 'Generowanie certyfikat\u00f3w PDF \u2014 przycisk "Certyfikaty" generuje za\u015bwiadczenia o cz\u0142onkostwie w formacie PDF dla wszystkich aktywnych cz\u0142onk\u00f3w. Certyfikaty s\u0105 zapisywane w Supabase Storage.',
            en: 'PDF certificate generation \u2014 the "Certificates" button generates membership certificates in PDF format for all active members. Certificates are saved in Supabase Storage.',
          },
          {
            pl: 'Masowe przypomnienia o sk\u0142adkach \u2014 przycisk "Przypomnienie sk\u0142adki" wysy\u0142a e-mail do wszystkich cz\u0142onk\u00f3w z wygas\u0142\u0105 sk\u0142adk\u0105. Przed wysy\u0142k\u0105 wy\u015bwietla podsumowanie z liczb\u0105 adresat\u00f3w.',
            en: 'Bulk fee reminders \u2014 the "Fee reminder" button sends an email to all members with expired fees. Before sending, it shows a summary with the number of recipients.',
          },
          {
            pl: 'Archiwizacja cz\u0142onk\u00f3w \u2014 zamiast usuwania, mo\u017cna przenie\u015b\u0107 cz\u0142onka do zak\u0142adki "Byli cz\u0142onkowie". Dane pozostaj\u0105 w bazie, a cz\u0142onek mo\u017ce by\u0107 przywr\u00f3cony przyciskiem "Przywr\u00f3\u0107".',
            en: 'Member archiving \u2014 instead of deleting, you can move a member to the "Former members" tab. Data stays in the database, and the member can be restored with the "Restore" button.',
          },
          {
            pl: 'Broadcast e-mail o wydarzeniach \u2014 w edytorze wydarze\u0144 przycisk "Wy\u015blij e-mail" rozsy\u0142a powiadomienie o nadchodz\u0105cym wydarzeniu do wszystkich aktywnych cz\u0142onk\u00f3w.',
            en: 'Event email broadcast \u2014 in the events editor, the "Send email" button sends a notification about an upcoming event to all active members.',
          },
          {
            pl: 'Eksport CSV \u2014 rozwijane menu "Eksport CSV" z dwoma opcjami: podstawowy (imi\u0119, nazwisko, e-mail) i pe\u0142ny (wszystkie pola z bazy).',
            en: 'CSV export \u2014 dropdown "CSV Export" menu with two options: basic (name, email) and full (all database fields).',
          },
          {
            pl: 'Kopiowanie adres\u00f3w e-mail \u2014 przycisk "Kopiuj maile" kopiuje adresy e-mail wszystkich aktywnych cz\u0142onk\u00f3w do schowka (oddzielone przecinkami).',
            en: 'Copy email addresses \u2014 the "Copy emails" button copies email addresses of all active members to clipboard (comma-separated).',
          },
        ],
      },
      {
        area: "panel",
        items: [
          {
            pl: "Przesy\u0142anie potwierdzenia p\u0142atno\u015bci \u2014 cz\u0142onek mo\u017ce przes\u0142a\u0107 skan/zdj\u0119cie potwierdzenia przelewu bezpo\u015brednio z panelu. Po zatwierdzeniu przez admina sk\u0142adka jest aktywowana automatycznie.",
            en: "Payment confirmation upload \u2014 a member can upload a scan/photo of their transfer confirmation directly from the panel. After admin approval, the fee is activated automatically.",
          },
          {
            pl: "Pobieranie certyfikatu \u2014 je\u015bli certyfikat zosta\u0142 wygenerowany, cz\u0142onek mo\u017ce go pobra\u0107 jednym klikni\u0119ciem z panelu.",
            en: "Certificate download \u2014 if a certificate has been generated, the member can download it with one click from the panel.",
          },
          {
            pl: "Edycja danych \u2014 cz\u0142onek mo\u017ce zmieni\u0107 e-mail, telefon, uczelni\u0119, kierunek, rok studi\u00f3w i status (student/absolwent) bezpo\u015brednio w panelu.",
            en: "Data editing \u2014 a member can change their email, phone, university, field of study, year of study, and status (student/graduate) directly in the panel.",
          },
          {
            pl: 'Rezygnacja z cz\u0142onkostwa \u2014 przycisk "Rezygnacja" pozwala cz\u0142onkowi samodzielnie opu\u015bci\u0107 stowarzyszenie. Profil zostaje zarchiwizowany.',
            en: 'Membership resignation \u2014 the "Resign" button allows a member to leave the association on their own. The profile is archived.',
          },
        ],
      },
      {
        area: "landing",
        items: [
          {
            pl: "Nowe favicony i logo \u2014 zaktualizowane ikony we wszystkich rozmiarach (16px\u2013512px), Apple Touch Icon, Open Graph image. Logo w wersji kolorowej i bia\u0142ej.",
            en: "New favicons and logos \u2014 updated icons in all sizes (16px\u2013512px), Apple Touch Icon, Open Graph image. Logo in color and white versions.",
          },
          {
            pl: "Responsywno\u015b\u0107 na bardzo ma\u0142ych ekranach \u2014 poprawki CSS dla urz\u0105dze\u0144 poni\u017cej 480px (mniejsze zdj\u0119cia zespo\u0142u, kompaktowe menu).",
            en: "Responsiveness on very small screens \u2014 CSS fixes for devices below 480px (smaller team photos, compact menu).",
          },
        ],
      },
    ],
  },
  {
    date: "2026-03-08",
    titlePl: "Edytor tre\u015bci CMS i zespo\u0142u",
    titleEn: "CMS content & team editor",
    sections: [
      {
        area: "admin",
        items: [
          {
            pl: 'Edytor tre\u015bci strony \u2014 zak\u0142adka "Tre\u015bci strony" pozwala edytowa\u0107 wszystkie sekcje strony g\u0142\u00f3wnej: hero (tytu\u0142, podtytu\u0142, statystyki), o nas (opis, karty), do\u0142\u0105cz (kroki, numer konta), wsp\u00f3\u0142praca i FAQ. Zmiany zapisuj\u0105 si\u0119 w Supabase i widoczne s\u0105 na stronie po od\u015bwie\u017ceniu.',
            en: 'Site content editor \u2014 the "Site content" tab allows editing all homepage sections: hero (title, subtitle, stats), about (description, cards), join (steps, bank account), cooperation, and FAQ. Changes save to Supabase and appear on the site after refresh.',
          },
          {
            pl: 'Edytor zespo\u0142u \u2014 zak\u0142adka "Zarz\u0105d" pozwala dodawa\u0107, usuwa\u0107 i zmienia\u0107 kolejno\u015b\u0107 cz\u0142onk\u00f3w zarz\u0105du, komisji rewizyjnej i opiekun\u00f3w. Zdj\u0119cia mo\u017cna przesy\u0142a\u0107 i kadrowa\u0107 (przycinanie do kwadratu z podgl\u0105dem).',
            en: 'Team editor \u2014 the "Board" tab allows adding, removing, and reordering board members, audit committee, and advisors. Photos can be uploaded and cropped (square crop with preview).',
          },
          {
            pl: 'Edytor wydarze\u0144 \u2014 zak\u0142adka "Wydarzenia" z oddzielnym formularzem dla nadchodz\u0105cego wydarzenia i list\u0105 przesz\u0142ych. Przycisk "Pobierz z Facebooka" automatycznie pobiera tytu\u0142 i zdj\u0119cie z linka do wydarzenia (Open Graph).',
            en: 'Events editor \u2014 the "Events" tab with a separate form for the upcoming event and a list of past ones. The "Fetch from Facebook" button automatically pulls the title and image from an event link (Open Graph).',
          },
          {
            pl: "Automatyczne t\u0142umaczenie PL\u2192EN \u2014 przy ka\u017cdym polu tekstowym przycisk t\u0142umaczenia wysy\u0142a tekst do API (/api/translate) i uzupe\u0142nia wersj\u0119 anglojęzyczn\u0105. T\u0142umaczenie uwzgl\u0119dnia kontekst sekcji.",
            en: "Automatic PL\u2192EN translation \u2014 each text field has a translate button that sends text to the API (/api/translate) and fills in the English version. Translation takes section context into account.",
          },
          {
            pl: 'System p\u0142atno\u015bci \u2014 zak\u0142adka "P\u0142atno\u015bci" wy\u015bwietla oczekuj\u0105ce potwierdzenia przelew\u00f3w. Admin widzi podgl\u0105d pliku, dane cz\u0142onka i status sk\u0142adki. Przyciski "Zatwierd\u017a" i "Odrzu\u0107" z opcjonalnym powodem odrzucenia.',
            en: 'Payment system \u2014 the "Payments" tab shows pending transfer confirmations. Admin sees file preview, member data, and fee status. "Approve" and "Reject" buttons with optional rejection reason.',
          },
        ],
      },
      {
        area: "landing",
        items: [
          {
            pl: "Sekcja wydarze\u0144 \u2014 nadchodz\u0105ce wydarzenie wy\u015bwietla si\u0119 jako wyr\u00f3\u017cniona karta ze zdj\u0119ciem, dat\u0105 i opisem PL/EN. Poni\u017cej siatka przesz\u0142ych wydarze\u0144 z miniaturami.",
            en: "Events section \u2014 the upcoming event displays as a highlighted card with image, date, and PL/EN description. Below it, a grid of past events with thumbnails.",
          },
          {
            pl: "Dynamiczny FAQ \u2014 sekcja FAQ na stronie \u0142aduje si\u0119 z bazy danych. Pytania rozwijaj\u0105 si\u0119 po klikni\u0119ciu (accordion). Tre\u015b\u0107 edytowalna z panelu admina.",
            en: "Dynamic FAQ \u2014 the FAQ section on the homepage loads from the database. Questions expand on click (accordion). Content editable from the admin panel.",
          },
        ],
      },
    ],
  },
  {
    date: "2026-03-08",
    titlePl: "Uruchomienie platformy SSK",
    titleEn: "SSK platform launch",
    sections: [
      {
        area: "landing",
        items: [
          {
            pl: "Strona g\u0142\u00f3wna z pe\u0142nym designem \u2014 sekcje: hero z animowanym EKG i statystykami, o nas z kartami funkcji, wydarzenia, zesp\u00f3\u0142 (zarz\u0105d + opiekunowie ze zdj\u0119ciami), do\u0142\u0105cz (3-krokowa instrukcja z numerem konta), FAQ i stopka z danymi rejestrowymi.",
            en: "Full-design homepage \u2014 sections: hero with animated ECG and stats, about with feature cards, events, team (board + advisors with photos), join (3-step instructions with bank account), FAQ, and footer with registration data.",
          },
          {
            pl: "Prze\u0142\u0105cznik j\u0119zyka PL/EN \u2014 przycisk w nawigacji prze\u0142\u0105cza wszystkie teksty na stronie mi\u0119dzy polskim i angielskim. Wyb\u00f3r zapami\u0119tywany w localStorage.",
            en: "PL/EN language switcher \u2014 button in the navigation toggles all text on the page between Polish and English. Choice is saved in localStorage.",
          },
          {
            pl: "Responsywny design \u2014 strona w pe\u0142ni dostosowana do urz\u0105dze\u0144 mobilnych. Nawigacja zmienia si\u0119 w wysuwane menu boczne, sekcje uk\u0142adaj\u0105 si\u0119 pionowo.",
            en: "Responsive design \u2014 the page is fully adapted for mobile devices. Navigation transforms into a slide-out side menu, sections stack vertically.",
          },
        ],
      },
      {
        area: "panel",
        items: [
          {
            pl: "Panel cz\u0142onka (/panel) \u2014 po zalogowaniu cz\u0142onek widzi swoje dane osobowe, status sk\u0142adki (aktywna/wygas\u0142a z dat\u0105 wa\u017cno\u015bci), histori\u0119 przes\u0142anych potwierdze\u0144 p\u0142atno\u015bci i opcj\u0119 wylogowania.",
            en: "Member panel (/panel) \u2014 after login, the member sees their personal data, fee status (active/expired with validity date), history of uploaded payment confirmations, and logout option.",
          },
          {
            pl: "Formularz rejestracji (/join) \u2014 wieloetapowy formularz z wyborem uczelni (22 uczelnie), kierunku, roku studi\u00f3w, statusu (student/absolwent). Dane osobowe: PESEL, data i miejsce urodzenia, adres, obywatelstwo. Zgody RODO i statut.",
            en: "Registration form (/join) \u2014 multi-step form with university selection (22 universities), field of study, year, status (student/graduate). Personal data: PESEL, birth date and place, address, citizenship. GDPR and statute consents.",
          },
          {
            pl: "Logowanie \u2014 strona /login z e-mailem i has\u0142em. Admini widz\u0105 wyb\u00f3r: panel admina lub panel cz\u0142onka.",
            en: "Login \u2014 /login page with email and password. Admins see a choice: admin panel or member panel.",
          },
        ],
      },
      {
        area: "admin",
        items: [
          {
            pl: "Panel admina (/admin) \u2014 dashboard z zak\u0142adkami: Cz\u0142onkowie, Byli cz\u0142onkowie, P\u0142atno\u015bci, Zarz\u0105d, Tre\u015bci strony, Wydarzenia. G\u00f3rny pasek ze statystykami (obecnych, aktywnych, wygas\u0142ych, oczekuj\u0105cych).",
            en: "Admin panel (/admin) \u2014 dashboard with tabs: Members, Former members, Payments, Board, Site content, Events. Top bar with stats (current, active, expired, pending).",
          },
          {
            pl: "Tabela cz\u0142onk\u00f3w \u2014 sortowalna i wyszukiwalna lista z filtrami (wszyscy/aktywne sk\u0142adki/wygas\u0142e). Klikni\u0119cie na cz\u0142onka otwiera pe\u0142ny profil. Przyciski akcji: archiwizuj, usu\u0144.",
            en: "Members table \u2014 sortable and searchable list with filters (all/active fees/expired). Clicking a member opens their full profile. Action buttons: archive, delete.",
          },
          {
            pl: "Ochrona dost\u0119pu \u2014 middleware sprawdza czy u\u017cytkownik jest zalogowany (na /panel i /admin) i czy jest adminem (na /admin). Nieautoryzowani s\u0105 przekierowywani na /login.",
            en: "Access protection \u2014 middleware checks if the user is logged in (for /panel and /admin) and if they are an admin (for /admin). Unauthorized users are redirected to /login.",
          },
        ],
      },
    ],
  },
];
