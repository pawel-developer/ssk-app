"use client";

import { useState } from "react";

const s = {
  card: { background: "#fff", borderRadius: 10, padding: 20, boxShadow: "0 4px 24px rgba(0,0,0,.12)", marginBottom: 12 } as React.CSSProperties,
  sectionTitle: {
    fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 0, cursor: "pointer",
    display: "flex", justifyContent: "space-between", alignItems: "center", userSelect: "none",
  } as React.CSSProperties,
  h3: { fontSize: 13, fontWeight: 700, color: "#334155", margin: "16px 0 8px" } as React.CSSProperties,
  p: { fontSize: 13, color: "#475569", lineHeight: 1.7, margin: "0 0 8px" } as React.CSSProperties,
  ul: { fontSize: 13, color: "#475569", lineHeight: 1.8, margin: "0 0 8px", paddingLeft: 20 } as React.CSSProperties,
  ol: { fontSize: 13, color: "#475569", lineHeight: 1.8, margin: "0 0 8px", paddingLeft: 20 } as React.CSSProperties,
  code: { background: "#f1f5f9", padding: "2px 6px", borderRadius: 4, fontSize: 12, fontFamily: "monospace", color: "#0f172a" } as React.CSSProperties,
  sql: { background: "#0f172a", color: "#e2e8f0", padding: "10px 14px", borderRadius: 8, fontSize: 12, fontFamily: "monospace", margin: "8px 0", overflowX: "auto" } as React.CSSProperties,
  table: { width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 12 } as React.CSSProperties,
  th: { textAlign: "left", padding: "8px 10px", background: "#f8fafc", fontWeight: 600, color: "#475569", borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap" } as React.CSSProperties,
  td: { padding: "8px 10px", borderBottom: "1px solid #f1f5f9", color: "#1e293b", verticalAlign: "top" } as React.CSSProperties,
  badge: (bg: string, color: string) => ({ display: "inline-block", padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: bg, color }) as React.CSSProperties,
};

function Section({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div style={s.card}>
      <div style={s.sectionTitle} onClick={() => setOpen((v) => !v)}>
        <span>{title}</span>
        <span style={{ fontSize: 12, color: "#94a3b8", transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }}>▼</span>
      </div>
      {open && <div style={{ marginTop: 12 }}>{children}</div>}
    </div>
  );
}

function GroupHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ margin: "28px 0 16px", borderTop: "1px solid rgba(255,255,255,.12)", paddingTop: 24 }}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: "#fff", marginBottom: 4 }}>{title}</h2>
      <p style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>{subtitle}</p>
    </div>
  );
}

export default function HelpGuide() {
  return (
    <div style={{ padding: 24, maxWidth: 920, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "#fff", marginBottom: 4 }}>Instrukcja</h2>
        <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>
          Jak zarządzać stroną SSK z poziomu tego panelu. Zacznij od góry &mdash; na dole znajdziesz bardziej zaawansowane tematy.
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  1. BASICS                                                 */}
      {/* ═══════════════════════════════════════════════════════════ */}

      <Section title="Jak się tu dostałem? Podstawy" defaultOpen>
        <p style={s.p}>
          Jesteś w <strong>Panelu Admina</strong>. Żeby tu wejść, potrzeba dwóch rzeczy:
        </p>
        <ol style={s.ol}>
          <li><strong>Konto</strong> &mdash; email i hasło, którymi logujesz się na <span style={s.code}>/login</span></li>
          <li><strong>Uprawnienia admina</strong> &mdash; flaga <span style={s.code}>is_admin</span> w bazie danych (bez niej trafisz do panelu członka)</li>
        </ol>
        <p style={s.p}>
          Wszystko, co zmienisz w zakładkach powyżej, pojawi się na stronie publicznej <strong>w ciągu minuty</strong>. Po edycji klikaj <strong>&quot;Zapisz wszystko&quot;</strong>.
        </p>
      </Section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  2. PUBLIC-FACING CONTENT                                  */}
      {/* ═══════════════════════════════════════════════════════════ */}

      <GroupHeading title="Edycja strony publicznej" subtitle="Wydarzenia, zarząd, treści i FAQ &mdash; to co odwiedzający widzą na stronie." />

      <Section title="Wydarzenia" defaultOpen>
        <p style={s.p}>Zakładka <strong>&quot;Wydarzenia&quot;</strong> &mdash; najczęściej używana funkcja panelu.</p>
        <h3 style={s.h3}>Dodawanie wydarzenia</h3>
        <ol style={s.ol}>
          <li>Kliknij <strong>&quot;+ Dodaj nadchodzące wydarzenie&quot;</strong></li>
          <li>Wklej <strong>link do wydarzenia na Facebooku</strong></li>
          <li>Kliknij <strong>&quot;Pobierz dane z Facebooka&quot;</strong> &mdash; tytuł, data i zdjęcie uzupełnią się automatycznie</li>
          <li>Popraw lub uzupełnij: opis, datę, miejsce, tryb (stacjonarnie / online)</li>
          <li>Kliknij <strong>&quot;Zapisz wszystko&quot;</strong></li>
        </ol>
        <h3 style={s.h3}>Powiadomienie członków</h3>
        <ul style={s.ul}>
          <li><strong>&quot;Wyślij ogłoszenie&quot;</strong> &mdash; e-mail z informacją o wydarzeniu do aktywnych członków</li>
          <li><strong>&quot;Wyślij link do spotkania&quot;</strong> &mdash; e-mail z linkiem Meet (tylko wydarzenia online)</li>
          <li>Przed wysyłką kliknij &quot;Podgląd&quot;, żeby zobaczyć treść e-maila</li>
        </ul>
        <h3 style={s.h3}>Po zakończeniu wydarzenia</h3>
        <ul style={s.ul}>
          <li>Kliknij <strong>&quot;Przenieś do przeszłych&quot;</strong> &mdash; wydarzenie przesunie się do dolnej listy</li>
          <li>Kolejność przeszłych wydarzeń możesz zmieniać strzałkami</li>
        </ul>
      </Section>

      <Section title="Zarząd i zespół">
        <p style={s.p}>Zakładka <strong>&quot;Zarząd&quot;</strong> &mdash; skład zespołu wyświetlany na stronie głównej.</p>
        <h3 style={s.h3}>Sekcje</h3>
        <ul style={s.ul}>
          <li><strong>Zarząd Główny</strong>, <strong>Komisja Rewizyjna</strong>, <strong>Opiekunowie naukowi</strong> &mdash; wbudowane grupy</li>
          <li>Przyciskiem <strong>&quot;+ Dodaj sekcję&quot;</strong> możesz dodać własną grupę (np. &quot;Koordynatorzy projektów&quot;)</li>
        </ul>
        <h3 style={s.h3}>Edycja osoby</h3>
        <ul style={s.ul}>
          <li><strong>Imię i nazwisko</strong>, <strong>stanowisko PL / EN</strong></li>
          <li><strong>Zdjęcie</strong> &mdash; kliknij &quot;Zmień zdjęcie&quot; &rarr; prześlij plik &rarr; przytnij do okręgu</li>
          <li>Kolejność osób: strzałki <strong>↑ / ↓</strong></li>
          <li>Nowa osoba: <strong>&quot;+ Dodaj&quot;</strong> na dole sekcji</li>
        </ul>
        <p style={s.p}>Po zmianach &rarr; <strong>&quot;Zapisz wszystko&quot;</strong>.</p>
      </Section>

      <Section title="Treści strony (tekst, FAQ, e-maile)">
        <p style={s.p}>Zakładka <strong>&quot;Treści strony&quot;</strong> &mdash; tekst sekcji Hero, O nas, Dołącz, Współpraca, FAQ i szablony e-maili.</p>
        <ul style={s.ul}>
          <li>Każda sekcja ma <strong>wersję PL i EN</strong> &mdash; przełączaj przyciskiem u góry</li>
          <li>Przycisk <strong>&quot;PL→EN&quot;</strong> przy polu tłumaczy automatycznie</li>
          <li><strong>&quot;Tłumacz całą sekcję&quot;</strong> tłumaczy wszystkie pola naraz</li>
        </ul>
        <h3 style={s.h3}>FAQ</h3>
        <p style={s.p}>Dodawaj, usuwaj i edytuj pytania/odpowiedzi w obu językach.</p>
        <h3 style={s.h3}>Szablony e-maili</h3>
        <p style={s.p}>
          Edytuj treść automatycznych wiadomości (potwierdzenie rejestracji, przypomnienie składki, urodziny, ogłoszenie wydarzenia).
          Szablony obsługują zmienne: <span style={s.code}>{"{{firstName}}"}</span>, <span style={s.code}>{"{{feeValidUntil}}"}</span>, <span style={s.code}>{"{{eventTitle}}"}</span> i inne.
        </p>
        <p style={s.p}>Po zmianach &rarr; <strong>&quot;Zapisz wszystko&quot;</strong>.</p>
      </Section>

      <Section title="Materiały edukacyjne">
        <p style={s.p}>Zakładka <strong>&quot;Materiały edukacyjne&quot;</strong> &mdash; biblioteka filmów i przypadków klinicznych dla członków.</p>
        <h3 style={s.h3}>Hierarchia treści</h3>
        <p style={s.p}>Materiały mają 3 poziomy:</p>
        <ol style={s.ol}>
          <li><strong>Kategoria</strong> &mdash; np. EKG, ECHO, Farmakologia</li>
          <li><strong>Podkategoria</strong> &mdash; np. &quot;Podstawy EKG&quot;, &quot;Zaburzenia rytmu&quot;</li>
          <li><strong>Materiał</strong> &mdash; film YouTube (lub kilka klipów) z opisem, autorem i tagami</li>
        </ol>
        <h3 style={s.h3}>Dodawanie kategorii / podkategorii</h3>
        <ol style={s.ol}>
          <li>Kliknij <strong>&quot;+ Nowa kategoria&quot;</strong> (lub &quot;+ Nowa podkategoria&quot; po wejściu w kategorię)</li>
          <li>Wpisz nazwę &mdash; slug (adres URL) wygeneruje się automatycznie</li>
          <li>Opcjonalnie dodaj opis</li>
          <li>Kliknij <strong>&quot;Utwórz&quot;</strong></li>
        </ol>
        <h3 style={s.h3}>Dodawanie materiału</h3>
        <ol style={s.ol}>
          <li>Wejdź do podkategorii i kliknij <strong>&quot;+ Nowy materiał&quot;</strong></li>
          <li>Wpisz tytuł, opis, autora</li>
          <li>Wklej <strong>link do YouTube</strong> &mdash; obsługiwane formaty: <span style={s.code}>youtube.com/watch?v=...</span>, <span style={s.code}>youtu.be/...</span>, embed URL, sam ID</li>
          <li>Możesz dodać <strong>kilka klipów</strong> (np. część 1, 2, 3 &mdash; członek zobaczy selektor klipów)</li>
          <li><strong>Notatki</strong> &mdash; opcjonalne, wyświetlą się jako boczny panel przy filmie (np. opis przypadku klinicznego)</li>
          <li><strong>Tagi</strong> &mdash; oddzielone przecinkami (np. &quot;arytmia, EKG, klinika&quot;)</li>
          <li>Kliknij <strong>&quot;Utwórz&quot;</strong></li>
        </ol>
        <h3 style={s.h3}>Publikowanie</h3>
        <ul style={s.ul}>
          <li>Każda kategoria, podkategoria i materiał ma przełącznik <strong>opublikowany / ukryty</strong></li>
          <li>Członkowie widzą <strong>tylko opublikowane</strong> materiały w swoim panelu (<span style={s.code}>/panel/education</span>)</li>
          <li>Możesz przygotować treści i opublikować je później</li>
        </ul>
        <h3 style={s.h3}>Usuwanie</h3>
        <ul style={s.ul}>
          <li>Usunięcie kategorii <strong>usuwa kaskadowo</strong> wszystkie jej podkategorie i materiały</li>
          <li>Usunięcie podkategorii usuwa wszystkie materiały w niej</li>
          <li>Przed usunięciem pojawi się okno potwierdzenia</li>
        </ul>
      </Section>

      <Section title="Changelog">
        <p style={s.p}>Zakładka <strong>&quot;Changelog&quot;</strong> &mdash; historia zmian w aplikacji.</p>
        <ul style={s.ul}>
          <li>Changelog jest aktualizowany automatycznie przy każdej sesji pracy nad kodem</li>
          <li>Wpisy pogrupowane są wg obszaru: <span style={s.badge("#fee2e2", "#dc2626")}>Strona główna</span>, <span style={s.badge("#e0f2fe", "#0369a1")}>Panel członka</span>, <span style={s.badge("#f3e8ff", "#7c3aed")}>Panel admina</span></li>
          <li>Członkowie mają własny widok changelog w panelu (<span style={s.code}>/panel/changelog</span>) &mdash; widoczne są tam tylko zmiany dotyczące strony i panelu członka (bez zmian admina)</li>
        </ul>
      </Section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  3. MEMBERS MANAGEMENT                                     */}
      {/* ═══════════════════════════════════════════════════════════ */}

      <GroupHeading title="Zarządzanie członkami" subtitle="Lista członków, składki, płatności i archiwum." />

      <Section title="Członkowie">
        <p style={s.p}>Zakładka <strong>&quot;Członkowie&quot;</strong> &mdash; lista aktywnych członków stowarzyszenia.</p>
        <ul style={s.ul}>
          <li><strong>Szukaj</strong> po nazwisku, e-mailu lub uczelni</li>
          <li><strong>Filtruj</strong> &mdash; wszyscy / aktywna składka / wygasła</li>
          <li><strong>Sortuj</strong> &mdash; kliknij nagłówek kolumny</li>
          <li>Kliknij w wiersz &rarr; <strong>profil członka</strong> (edycja danych, składka)</li>
        </ul>
        <h3 style={s.h3}>Przydatne narzędzia</h3>
        <ul style={s.ul}>
          <li><strong>&quot;Kopiuj maile&quot;</strong> &mdash; adresy aktywnych członków do schowka</li>
          <li><strong>&quot;Eksport CSV&quot;</strong> &mdash; podstawowy (imię, nazwisko, email) lub pełny (wszystkie pola)</li>
          <li><strong>&quot;Certyfikaty&quot;</strong> &mdash; generuje zaświadczenia PDF dla aktywnych członków</li>
          <li><strong>&quot;Przypomnienie składki&quot;</strong> &mdash; masowy e-mail do osób z wygasłą składką</li>
        </ul>
        <h3 style={s.h3}>Archiwizacja i usuwanie</h3>
        <ul style={s.ul}>
          <li><strong>&quot;Archiwizuj&quot;</strong> &mdash; przenosi do byłych członków (można przywrócić)</li>
          <li><strong>&quot;Usuń&quot;</strong> &mdash; trwałe usunięcie konta (nieodwracalne!)</li>
          <li>Zakładka <strong>&quot;Byli członkowie&quot;</strong> &mdash; zarchiwizowani z opcją przywrócenia</li>
        </ul>
      </Section>

      <Section title="Płatności">
        <p style={s.p}>Zakładka <strong>&quot;Płatności&quot;</strong> &mdash; potwierdzenia wpłat od członków.</p>
        <ol style={s.ol}>
          <li>Członek przesyła potwierdzenie przelewu przez swój panel (<span style={s.code}>/panel</span>)</li>
          <li>Potwierdzenie pojawia się tutaj jako karta z danymi członka</li>
          <li><strong>&quot;Podgląd&quot;</strong> &mdash; otwiera przesłany plik (zdjęcie lub PDF)</li>
          <li><strong>&quot;Zatwierdź&quot;</strong> &mdash; aktywuje składkę na rok</li>
          <li><strong>&quot;Odrzuć&quot;</strong> &mdash; z opcjonalnym powodem (członek dostanie e-mail)</li>
        </ol>
      </Section>

      <Section title="Nadawanie uprawnień nowemu adminowi">
        <p style={s.p}>Potrzebujesz dostępu do <strong>Supabase Dashboard</strong> (patrz sekcja zaawansowana).</p>
        <ol style={s.ol}>
          <li>Supabase Dashboard &rarr; <strong>Authentication &rarr; Users &rarr; &quot;Add user&quot;</strong> &rarr; wpisz email i hasło</li>
          <li>
            Supabase &rarr; <strong>SQL Editor</strong> &rarr; wykonaj:
            <div style={s.sql}>
              UPDATE public.profiles SET is_admin = true WHERE email = &apos;nowy@admin.pl&apos;;
            </div>
          </li>
          <li>Nowy admin loguje się na <span style={s.code}>/login</span> i wybiera &quot;Panel administracyjny&quot;</li>
        </ol>
        <p style={{ ...s.p, fontSize: 12, color: "#64748b" }}>
          Jeśli osoba zarejestrowała się sama przez <span style={s.code}>/join</span>, wystarczy tylko krok 2.
        </p>
      </Section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  4. TROUBLESHOOTING (bridge between content & advanced)    */}
      {/* ═══════════════════════════════════════════════════════════ */}

      <Section title="Coś nie działa?">
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Problem</th>
              <th style={s.th}>Co zrobić</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={s.td}>Zmiany nie pojawiają się na stronie</td>
              <td style={s.td}>Upewnij się, że kliknąłeś &quot;Zapisz wszystko&quot;. Odczekaj minutę i odśwież stronę.</td>
            </tr>
            <tr>
              <td style={s.td}>Po zalogowaniu trafia do panelu członka</td>
              <td style={s.td}>Brak flagi <span style={s.code}>is_admin</span> &mdash; patrz &quot;Nadawanie uprawnień nowemu adminowi&quot;</td>
            </tr>
            <tr>
              <td style={s.td}>Zdjęcie nie wyświetla się</td>
              <td style={s.td}>Sprawdź czy buckety <span style={s.code}>event-images</span> i <span style={s.code}>team-photos</span> istnieją w Supabase Storage</td>
            </tr>
            <tr>
              <td style={s.td}>Tłumaczenie PL→EN nie działa</td>
              <td style={s.td}>Bez klucza OpenAI używany jest darmowy serwis z limitem ~450 znaków. Działa, ale gorzej.</td>
            </tr>
            <tr>
              <td style={s.td}>E-maile nie dochodzą</td>
              <td style={s.td}>Sprawdź zmienne <span style={s.code}>BREVO_API_KEY</span> i <span style={s.code}>BREVO_FROM_EMAIL</span> w Vercelu</td>
            </tr>
            <tr>
              <td style={s.td}>Google Meet się nie tworzy</td>
              <td style={s.td}>Sprawdź zmienne <span style={s.code}>GOOGLE_*</span> w Vercelu. Refresh token może wymagać odnowienia.</td>
            </tr>
          </tbody>
        </table>
      </Section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  5. ADVANCED — CODE CHANGES                                */}
      {/* ═══════════════════════════════════════════════════════════ */}

      <GroupHeading title="Zmiany w kodzie" subtitle="Dla osób, które chcą modyfikować sam serwis &mdash; wygląd, logikę, infrastrukturę." />

      <Section title="Jak to wszystko działa (architektura)">
        <p style={s.p}>Strona SSK to kilka połączonych serwisów:</p>
        <ol style={s.ol}>
          <li><strong>GitHub</strong> &mdash; przechowuje kod źródłowy</li>
          <li><strong>Vercel</strong> &mdash; hostuje stronę, automatycznie ją buduje przy każdej zmianie kodu</li>
          <li><strong>Supabase</strong> &mdash; baza danych, logowanie użytkowników, przechowywanie plików (zdjęcia, certyfikaty)</li>
          <li><strong>Brevo</strong> &mdash; wysyłka e-maili</li>
        </ol>
        <p style={s.p}>
          Treści edytowalne z panelu admina (tekst, zarząd, wydarzenia) są w <strong>bazie Supabase</strong> &mdash; nie w kodzie. Żeby je zmienić, nie trzeba dotykać kodu. Kod trzeba zmienić, gdy chcesz zmodyfikować <strong>wygląd strony, logikę działania lub dodać nową funkcjonalność</strong>.
        </p>
      </Section>

      <Section title="Cursor &mdash; edycja kodu">
        <p style={s.p}>
          <a href="https://cursor.com" target="_blank" rel="noopener noreferrer" style={{ color: "#0369a1" }}>Cursor</a> to edytor kodu z wbudowanym AI, oparty na VS Code. Strona SSK jest rozwijana w Cursorze.
        </p>
        <h3 style={s.h3}>Czego potrzebujesz</h3>
        <ul style={s.ul}>
          <li><a href="https://cursor.com" target="_blank" rel="noopener noreferrer" style={{ color: "#0369a1" }}>Cursor</a> &mdash; darmowy (Pro daje więcej zapytań AI)</li>
          <li><a href="https://nodejs.org" target="_blank" rel="noopener noreferrer" style={{ color: "#0369a1" }}>Node.js</a> (v18+) &mdash; do uruchamiania projektu lokalnie</li>
          <li>Dostęp do <strong>repozytorium GitHub</strong> &mdash; właściciel musi dodać jako collaboratora</li>
          <li>Plik <span style={s.code}>.env.local</span> &mdash; skopiuj od właściciela projektu</li>
        </ul>
        <h3 style={s.h3}>Pierwsze uruchomienie</h3>
        <ol style={s.ol}>
          <li>Zainstaluj Cursor i Node.js</li>
          <li>
            Sklonuj repozytorium:
            <div style={s.sql}>git clone https://github.com/pawel-developer/ssk-app.git</div>
          </li>
          <li>Otwórz folder <span style={s.code}>ssk-app</span> w Cursorze</li>
          <li>Utwórz plik <span style={s.code}>.env.local</span> z odpowiednimi zmiennymi (dostaniesz od właściciela)</li>
          <li>
            W terminalu Cursora:
            <div style={s.sql}>npm install<br />npm run dev</div>
          </li>
          <li>Otwórz <span style={s.code}>http://localhost:3000</span></li>
        </ol>
        <h3 style={s.h3}>Struktura plików</h3>
        <div style={{ ...s.sql, lineHeight: 1.6 }}>
          src/app/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← strony (page.tsx = strona główna, admin/, panel/, api/)<br />
          src/components/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← komponenty React (edytory admina, navbar...)<br />
          src/data/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← dane statyczne (changelog)<br />
          src/lib/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← Supabase client, mailer, certyfikaty<br />
          public/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← statyczne pliki (zdjęcia, fonty)<br />
          supabase/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← migracje SQL bazy danych
        </div>
        <h3 style={s.h3}>AI w Cursorze</h3>
        <ul style={s.ul}>
          <li><strong>Cmd+K</strong> &mdash; edytuj zaznaczony kod za pomocą AI</li>
          <li><strong>Cmd+L</strong> &mdash; chat AI z kontekstem pliku</li>
          <li><strong>Cmd+I</strong> &mdash; tryb agenta &mdash; AI tworzy/edytuje pliki i uruchamia komendy</li>
          <li>Możesz pisać po polsku, np. <em>&quot;Zmień kolor nagłówka na czerwony&quot;</em></li>
        </ul>
      </Section>

      <Section title="GitHub &mdash; zapisywanie i publikowanie zmian">
        <p style={s.p}>
          Każda zmiana w kodzie idzie przez Gita. Nie musisz być ekspertem &mdash; wystarczą 3 komendy.
        </p>
        <h3 style={s.h3}>Czego potrzebujesz</h3>
        <ul style={s.ul}>
          <li>Konto na <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: "#0369a1" }}>github.com</a></li>
          <li>Właściciel repo musi dodać Cię jako collaboratora (Settings &rarr; Collaborators)</li>
        </ul>
        <h3 style={s.h3}>Jak opublikować zmianę</h3>
        <p style={s.p}>Po wprowadzeniu zmian w Cursorze, otwórz terminal i wpisz:</p>
        <div style={s.sql}>
          git add .<br />
          git commit -m &quot;opis co zmieniłeś&quot;<br />
          git push origin main
        </div>
        <p style={s.p}>
          Po pushu na <span style={s.code}>main</span> Vercel automatycznie zbuduje i opublikuje nową wersję strony (trwa ok. 1-2 min).
        </p>
        <h3 style={s.h3}>Zanim zaczniesz edytować</h3>
        <p style={s.p}>Zawsze najpierw pobierz najnowszą wersję:</p>
        <div style={s.sql}>git pull origin main</div>
        <p style={{ ...s.p, fontSize: 12, color: "#64748b" }}>
          W Cursorze możesz też użyć wbudowanego panelu Git (ikona gałęzi po lewej) zamiast terminala.
        </p>
      </Section>

      <Section title="Vercel &mdash; hosting i deploy">
        <p style={s.p}>Vercel hostuje stronę. Nie musisz nic robić ręcznie &mdash; deploy jest automatyczny po pushu na GitHub.</p>
        <h3 style={s.h3}>Czego potrzebujesz</h3>
        <ul style={s.ul}>
          <li>Konto na <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: "#0369a1" }}>vercel.com</a> (najlepiej zaloguj się przez GitHub)</li>
          <li>Właściciel projektu musi zaprosić do zespołu (Settings &rarr; Members)</li>
        </ul>
        <h3 style={s.h3}>Kiedy potrzebujesz dashboardu Vercela</h3>
        <ul style={s.ul}>
          <li><strong>Deployments</strong> &mdash; sprawdzenie statusu buildu, logi błędów</li>
          <li><strong>Settings &rarr; Environment Variables</strong> &mdash; zmiana kluczy API (np. Brevo, Supabase)</li>
          <li><strong>Settings &rarr; Domains</strong> &mdash; konfiguracja domeny</li>
          <li><strong>Logs</strong> &mdash; debugowanie błędów na produkcji</li>
        </ul>
        <h3 style={s.h3}>Zmiana zmiennej środowiskowej</h3>
        <ol style={s.ol}>
          <li>Vercel Dashboard &rarr; projekt &rarr; <strong>Settings &rarr; Environment Variables</strong></li>
          <li>Dodaj lub zmień &rarr; <strong>Save</strong></li>
          <li><strong>Redeploy</strong> &mdash; Deployments &rarr; &quot;...&quot; &rarr; &quot;Redeploy&quot; (zmienne działają dopiero po rebuildzie)</li>
        </ol>
      </Section>

      <Section title="Supabase &mdash; baza danych">
        <p style={s.p}>
          Supabase przechowuje dane użytkowników, treści strony i pliki. Potrzebujesz go głównie do: tworzenia adminów, debugowania danych i zarządzania plikami.
        </p>
        <h3 style={s.h3}>Czego potrzebujesz</h3>
        <ul style={s.ul}>
          <li>Konto na <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" style={{ color: "#0369a1" }}>supabase.com</a></li>
          <li>Właściciel dodaje do organizacji (Organization Settings &rarr; Members)</li>
        </ul>
        <h3 style={s.h3}>Najważniejsze zakładki w dashboardzie</h3>
        <ul style={s.ul}>
          <li><strong>Table Editor</strong> &mdash; przeglądanie danych (jak Excel dla bazy danych)</li>
          <li><strong>SQL Editor</strong> &mdash; zapytania SQL (np. nadanie uprawnień admina)</li>
          <li><strong>Authentication &rarr; Users</strong> &mdash; tworzenie i zarządzanie kontami</li>
          <li><strong>Storage</strong> &mdash; pliki: zdjęcia zespołu, wydarzeń, potwierdzenia wpłat, certyfikaty</li>
          <li><strong>Settings &rarr; API</strong> &mdash; klucze API (potrzebne do zmiennych środowiskowych)</li>
        </ul>
        <h3 style={s.h3}>Przydatne zapytania SQL</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div>
            <p style={{ ...s.p, fontWeight: 600, marginBottom: 4 }}>Nadanie uprawnień admina:</p>
            <div style={s.sql}>UPDATE public.profiles SET is_admin = true WHERE email = &apos;email@example.com&apos;;</div>
          </div>
          <div>
            <p style={{ ...s.p, fontWeight: 600, marginBottom: 4 }}>Lista adminów:</p>
            <div style={s.sql}>SELECT email, first_name, last_name FROM profiles WHERE is_admin = true;</div>
          </div>
          <div>
            <p style={{ ...s.p, fontWeight: 600, marginBottom: 4 }}>Aktywni z wygasłą składką:</p>
            <div style={s.sql}>
              SELECT email, first_name, last_name, fee_valid_until<br />
              FROM profiles<br />
              WHERE NOT is_archived AND (fee_valid_until IS NULL OR fee_valid_until &lt; CURRENT_DATE);
            </div>
          </div>
        </div>
      </Section>

      <Section title="Zmienne środowiskowe &mdash; pełna lista">
        <p style={s.p}>Ustawiane w Vercel (Settings &rarr; Environment Variables) oraz lokalnie w pliku <span style={s.code}>.env.local</span>.</p>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Zmienna</th>
              <th style={s.th}>Wymagana?</th>
              <th style={s.th}>Opis</th>
            </tr>
          </thead>
          <tbody>
            {([
              ["NEXT_PUBLIC_SUPABASE_URL", true, "URL projektu Supabase"],
              ["NEXT_PUBLIC_SUPABASE_ANON_KEY", true, "Klucz publiczny Supabase"],
              ["SUPABASE_SERVICE_ROLE_KEY", true, "Klucz serwisowy (upload zdjęć, operacje admin)"],
              ["NEXT_PUBLIC_APP_URL", true, "URL strony (np. https://sskardio.pl)"],
              ["BREVO_API_KEY", true, "Klucz API Brevo (e-maile)"],
              ["BREVO_FROM_EMAIL", true, "Adres nadawcy e-maili"],
              ["BREVO_FROM_NAME", false, 'Nazwa nadawcy (domyślnie "SSK")'],
              ["CRON_SECRET", true, "Token dla crona urodzinowego"],
              ["GOOGLE_CLIENT_ID", false, "Google Calendar/Meet"],
              ["GOOGLE_CLIENT_SECRET", false, "Google Calendar/Meet"],
              ["GOOGLE_REFRESH_TOKEN", false, "Google Calendar/Meet"],
              ["OPENAI_API_KEY", false, "Lepsza translacja PL→EN"],
            ] as const).map(([name, required, desc]) => (
              <tr key={name}>
                <td style={s.td}><span style={s.code}>{name}</span></td>
                <td style={s.td}>
                  {required
                    ? <span style={s.badge("#16a34a", "#dcfce7")}>tak</span>
                    : <span style={s.badge("#64748b", "#f1f5f9")}>nie</span>}
                </td>
                <td style={s.td}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Stawianie projektu od zera">
        <p style={s.p}>Gdybyś musiał postawić stronę na nowym koncie:</p>
        <ol style={s.ol}>
          <li><strong>Supabase</strong> &mdash; nowy projekt na <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" style={{ color: "#0369a1" }}>supabase.com</a></li>
          <li><strong>Migracje</strong> &mdash; uruchom pliki SQL z folderu <span style={s.code}>supabase/</span> w SQL Editor, po kolei:
            <span style={s.code}>migration.sql</span> &rarr; <span style={s.code}>fix-rls-v3.sql</span> &rarr; <span style={s.code}>migration-registration-fields.sql</span> &rarr; <span style={s.code}>migration-members-archive.sql</span> &rarr; <span style={s.code}>migration-site-content.sql</span> &rarr; <span style={s.code}>migration-event-images-bucket.sql</span> &rarr; <span style={s.code}>migration-email-templates.sql</span> &rarr; <span style={s.code}>migration-certificates-bucket.sql</span> &rarr; <span style={s.code}>migration-performance-indexes.sql</span> &rarr; <span style={s.code}>migration-education.sql</span> &rarr; <span style={s.code}>migration-education-publish.sql</span>
          </li>
          <li><strong>Auth URLs</strong> &mdash; Supabase &rarr; Settings &rarr; Authentication &rarr; dodaj <span style={s.code}>https://twoja-domena.pl/auth/callback</span> i <span style={s.code}>/reset-password</span></li>
          <li><strong>Admin</strong> &mdash; utwórz konto (Authentication &rarr; Users) i nadaj <span style={s.code}>is_admin = true</span></li>
          <li><strong>GitHub</strong> &mdash; fork lub sklonuj <a href="https://github.com/pawel-developer/ssk-app" target="_blank" rel="noopener noreferrer" style={{ color: "#0369a1" }}>repozytorium</a></li>
          <li><strong>Vercel</strong> &mdash; zaimportuj z GitHub na <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer" style={{ color: "#0369a1" }}>vercel.com/new</a></li>
          <li><strong>Env vars</strong> &mdash; ustaw wszystkie w Vercelu (patrz lista wyżej)</li>
          <li><strong>Brevo</strong> &mdash; konto na <a href="https://app.brevo.com" target="_blank" rel="noopener noreferrer" style={{ color: "#0369a1" }}>brevo.com</a>, API key, weryfikacja domeny</li>
        </ol>
      </Section>
    </div>
  );
}
