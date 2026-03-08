import Image from "next/image";
import Navbar from "@/components/Navbar";
import EventsSection from "@/components/EventsSection";
import FAQ from "@/components/FAQ";

const boardMembers = [
  { name: "Adrian Bednarek", role: { pl: "Prezes Zarządu Głównego", en: "President" }, img: "team-adrian" },
  { name: "lek. Paweł Siuciak", role: { pl: "Zastępca Prezesa", en: "Vice President" }, img: "team-pawel" },
  { name: "lek. Marta Mazur", role: { pl: "Sekretarz", en: "Secretary" }, img: "team-marta-m" },
  { name: "lek. Marta Chamera", role: { pl: "Skarbnik", en: "Treasurer" }, img: "team-marta-c" },
  { name: "lek. Patryk Pindlowski", role: { pl: "Członek Zarządu", en: "Board Member" }, img: "team-patryk" },
  { name: "Emil Brociek", role: { pl: "Członek Zarządu", en: "Board Member" }, img: "team-emil" },
  { name: "Aniela Zaboklicka", role: { pl: "Członek Zarządu", en: "Board Member" }, img: "team-aniela" },
  { name: "Natan Adamów", role: { pl: "Członek Zarządu", en: "Board Member" }, img: "team-natan" },
];

const auditMembers = [
  { name: "lek. Alicja Skrobucha", role: { pl: "Przewodnicząca Komisji Rewizyjnej", en: "Chair of Audit Committee" }, img: "team-alicja" },
  { name: "lek. Olga Wiśniewska", role: { pl: "Członek Komisji Rewizyjnej", en: "Audit Committee Member" }, img: "team-olga" },
  { name: "lek. Magdalena Synak", role: { pl: "Członek Komisji Rewizyjnej", en: "Audit Committee Member" }, img: "team-magdalena" },
];

const advisors = [
  { name: "Prof. Miłosz Jaguszewski", img: "advisor-jaguszewski" },
  { name: "Prof. Mariusz Tomaniak", img: "advisor-tomaniak" },
  { name: "Prof. Paweł Balsam", img: "advisor-balsam" },
  { name: "Prof. Piotr Buszman", img: "advisor-buszman" },
  { name: "Prof. Paweł Gąsior", img: "advisor-gasior" },
  { name: "Prof. Marcin Grabowski", img: "advisor-grabowski" },
];

function TeamCard({ name, role, img, type }: { name: string; role?: { pl: string; en: string }; img: string; type: "board" | "audit" | "advisor" }) {
  return (
    <div className="team-card">
      <div className={`team-photo ${type}`}>
        <Image src={`/img/${img}.webp`} alt={name} width={140} height={140} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <h4>{name}</h4>
      {role && <p data-pl={role.pl} data-en={role.en}>{role.pl}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />

      {/* ============ HERO ============ */}
      <section className="hero" id="hero">
        <div className="hero-bg">
          <div className="hero-particle p1" />
          <div className="hero-particle p2" />
          <div className="hero-particle p3" />
          <svg className="hero-ecg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path className="ecg-line" d="M0,60 L200,60 L220,60 L240,20 L260,100 L280,10 L300,90 L320,60 L500,60 L520,60 L540,20 L560,100 L580,10 L600,90 L620,60 L800,60 L820,60 L840,20 L860,100 L880,10 L900,90 L920,60 L1200,60" />
          </svg>
        </div>
        <div className="hero-content">
          <h1>
            <span data-pl="Studenckie" data-en="Student">Studenckie</span><br />
            <span data-pl="Stowarzyszenie" data-en="Cardiology">Stowarzyszenie</span><br />
            <span className="text-accent" data-pl="Kardiologiczne" data-en="Association">Kardiologiczne</span>
          </h1>
          <p className="hero-subtitle" data-pl="Łączymy studentów wszystkich kierunków medycznych i ścisłych, połączonych wspólną pasją do kardiologii. Zrzeszamy osoby do 3 lat od ukończenia studiów." data-en="We unite students of all medical and science fields, connected by a shared passion for cardiology. Open to graduates up to 3 years after completing their studies.">
            Łączymy studentów wszystkich kierunków medycznych i ścisłych, połączonych wspólną pasją do kardiologii. Zrzeszamy osoby do 3 lat od ukończenia studiów.
          </p>
          <div className="hero-buttons">
            <a href="#join" className="btn btn-primary" data-pl="Dołącz do nas" data-en="Join Us">Dołącz do nas</a>
            <a href="#about" className="btn btn-outline" data-pl="Dowiedz się więcej" data-en="Learn more">Dowiedz się więcej</a>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">200+</span>
              <span className="stat-label" data-pl="Członków" data-en="Members">Członków</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">15+</span>
              <span className="stat-label" data-pl="Uczelni medycznych" data-en="Medical universities">Uczelni medycznych</span>
            </div>
          </div>
        </div>
        <div className="hero-logo-float">
          <Image src="/img/logo.webp" alt="SSK Logo" width={450} height={450} />
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section className="section about" id="about">
        <div className="container">
          <div className="section-header">
            <span className="section-tag" data-pl="Kim jesteśmy" data-en="Who we are">Kim jesteśmy</span>
            <h2 data-pl="Więcej niż koło naukowe" data-en="More than a student club">Więcej niż koło naukowe</h2>
            <p className="section-desc about-mission" data-pl="SSK to ogólnopolska sieć studentów, którzy nie czekają na dyplom, żeby zacząć robić rzeczy w kardiologii. Organizujemy to, czego brakuje na uczelniach — praktyczne warsztaty, dostęp do ekspertów i środowisko ludzi, którzy chcą więcej." data-en="SSK is a nationwide network of students who don't wait for a diploma to get involved in cardiology. We organize what universities lack — hands-on workshops, access to experts, and a community of people who want more.">
              SSK to ogólnopolska sieć studentów, którzy nie czekają na dyplom, żeby zacząć robić rzeczy w kardiologii. Organizujemy to, czego brakuje na uczelniach — praktyczne warsztaty, dostęp do ekspertów i środowisko ludzi, którzy chcą więcej.
            </p>
          </div>
          <div className="about-grid">
            <div className="about-card">
              <div className="about-icon">🫀</div>
              <h3 data-pl="Ręce na ECHO i EKG" data-en="Hands on ECHO & ECG">Ręce na ECHO i EKG</h3>
              <p data-pl="Nie tylko teoria. Warsztaty echokardiografii, EKG, symulacje medyczne, cewnikowanie — uczysz się na sprzęcie, nie ze slajdów." data-en="Not just theory. Echocardiography workshops, ECG, medical simulations, catheterization — you learn on real equipment, not from slides.">
                Nie tylko teoria. Warsztaty echokardiografii, EKG, symulacje medyczne, cewnikowanie — uczysz się na sprzęcie, nie ze slajdów.
              </p>
            </div>
            <div className="about-card">
              <div className="about-icon">🌍</div>
              <h3 data-pl="Sieć z 15+ uczelni" data-en="Network from 15+ universities">Sieć z 15+ uczelni</h3>
              <p data-pl="Studenci z WUM, GUMed, UJ, UM Wrocław i wielu innych. Szkoły letnie w Gdańsku, konferencje w Warszawie, spotkania online z całej Polski." data-en="Students from WUM, GUMed, UJ, UM Wrocław and many more. Summer schools in Gdańsk, conferences in Warsaw, online meetings from across Poland.">
                Studenci z WUM, GUMed, UJ, UM Wrocław i wielu innych. Szkoły letnie w Gdańsku, konferencje w Warszawie, spotkania online z całej Polski.
              </p>
            </div>
            <div className="about-card">
              <div className="about-icon">🎓</div>
              <h3 data-pl="Eksperci jako mentorzy" data-en="Experts as mentors">Eksperci jako mentorzy</h3>
              <p data-pl="Prof. Jaguszewski, prof. Balsam, prof. Buszman i inni — nasi opiekunowie merytoryczni to liderzy polskiej kardiologii, którzy prowadzą wykłady i warsztaty specjalnie dla nas." data-en="Prof. Jaguszewski, Prof. Balsam, Prof. Buszman and others — our academic advisors are leaders of Polish cardiology who give lectures and workshops exclusively for us.">
                Prof. Jaguszewski, prof. Balsam, prof. Buszman i inni — nasi opiekunowie merytoryczni to liderzy polskiej kardiologii, którzy prowadzą wykłady i warsztaty specjalnie dla nas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ EVENTS ============ */}
      <EventsSection />

      {/* ============ TEAM ============ */}
      <section className="section team" id="team">
        <div className="container">
          <div className="section-header">
            <span className="section-tag" data-pl="Nasz zespół" data-en="Our team">Nasz zespół</span>
            <h2 data-pl="Zarząd i opiekunowie" data-en="Board & Advisors">Zarząd i opiekunowie</h2>
          </div>

          <h3 className="team-section-title" data-pl="Zarząd Główny" data-en="Main Board">Zarząd Główny</h3>
          <div className="team-grid team-grid-zarzad">
            {boardMembers.map((m) => (
              <TeamCard key={m.img} name={m.name} role={m.role} img={m.img} type="board" />
            ))}
          </div>

          <h3 className="team-section-title" data-pl="Komisja Rewizyjna" data-en="Audit Committee">Komisja Rewizyjna</h3>
          <div className="team-grid team-grid-3">
            {auditMembers.map((m) => (
              <TeamCard key={m.img} name={m.name} role={m.role} img={m.img} type="audit" />
            ))}
          </div>

          <h3 className="team-section-title" data-pl="Opiekunowie merytoryczni" data-en="Academic Advisors">Opiekunowie merytoryczni</h3>
          <div className="team-grid team-grid-3">
            {advisors.map((m) => (
              <TeamCard key={m.img} name={m.name} img={m.img} type="advisor" />
            ))}
          </div>
        </div>
      </section>

      {/* ============ JOIN ============ */}
      <section className="section join" id="join">
        <div className="container">
          <div className="section-header">
            <span className="section-tag" data-pl="Członkostwo" data-en="Membership">Członkostwo</span>
            <h2 data-pl="Dołącz do nas" data-en="Join Us">Dołącz do nas</h2>
          </div>
          <div className="join-content">
            <div className="join-steps">
              <div className="join-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3 data-pl="Wypełnij formularz" data-en="Fill out the form">Wypełnij formularz</h3>
                  <p data-pl="Kliknij poniższy przycisk i wypełnij formularz zgłoszeniowy — zajmie to tylko kilka minut." data-en="Click the button below and fill out the application form — it only takes a few minutes.">
                    Kliknij poniższy przycisk i wypełnij formularz zgłoszeniowy — zajmie to tylko kilka minut.
                  </p>
                  <a href="https://docs.google.com/forms/d/e/1FAIpQLSeP44kdz7k6B0EET0rNrP9eBJX0y9uo4z8ScOpr2v7yngbg4Q/viewform" target="_blank" rel="noopener" className="btn btn-primary btn-sm" style={{ marginTop: 12 }} data-pl="Otwórz formularz" data-en="Open form">
                    Otwórz formularz
                  </a>
                </div>
              </div>
              <div className="join-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3 data-pl="Opłać składkę" data-en="Pay membership fee">Opłać składkę</h3>
                  <p data-pl="Składka członkowska wynosi 50 zł rocznie." data-en="The annual membership fee is 50 PLN.">
                    Składka członkowska wynosi 50 zł rocznie.
                  </p>
                  <div className="account-box">
                    <span className="account-label" data-pl="Numer konta:" data-en="Account number:">Numer konta:</span>{" "}
                    <code>43 1600 1462 1710 3081 5000 0001</code>
                    <br /><br />
                    <span className="account-label" data-pl="Odbiorca:" data-en="Recipient:">Odbiorca:</span>{" "}
                    <span>Studenckie Stowarzyszenie Kardiologiczne</span>
                    <br />
                    <span>ul. 1 Maja 6/61, 02-495 Warszawa</span>
                    <br /><br />
                    <span className="account-label" data-pl="Tytuł:" data-en="Title:">Tytuł:</span>{" "}
                    <span data-pl="Składka członkowska Imię Nazwisko Uczelnia" data-en="Membership fee First-Name Last-Name University">
                      Składka członkowska Imię Nazwisko Uczelnia
                    </span>
                  </div>
                </div>
              </div>
              <div className="join-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3 data-pl="Czekaj na potwierdzenie" data-en="Wait for confirmation">Czekaj na potwierdzenie</h3>
                  <p data-pl="Po zaksięgowaniu wpłaty i weryfikacji formularza otrzymasz potwierdzenie członkostwa. Jeśli masz pytania, napisz do nas:" data-en="After the payment is registered and your form is verified, you will receive membership confirmation. If you have questions, contact us:">
                    Po zaksięgowaniu wpłaty i weryfikacji formularza otrzymasz potwierdzenie członkostwa. Jeśli masz pytania, napisz do nas:
                  </p>
                  <a href="mailto:studenckiestowarzyszeniekardio@gmail.com" className="email-link">studenckiestowarzyszeniekardio@gmail.com</a>
                </div>
              </div>
            </div>
            <div className="join-info-box">
              <div className="info-box-icon">ℹ️</div>
              <p data-pl="Jeśli nie otrzymasz potwierdzenia w ciągu kilku dni, sprawdź folder spam lub napisz do nas na powyższy adres e-mail." data-en="If you don't receive confirmation within a few days, check your spam folder or email us at the address above.">
                Jeśli nie otrzymasz potwierdzenia w ciągu kilku dni, sprawdź folder spam lub napisz do nas na powyższy adres e-mail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ COOPERATION ============ */}
      <section className="section cooperation">
        <div className="container">
          <div className="coop-card">
            <div className="coop-content">
              <h2 data-pl="Współpraca z SKN" data-en="Cooperation with Student Scientific Circles">Współpraca z SKN</h2>
              <p data-pl="Studenckie Koła Naukowe mogą nawiązać z nami współpracę. Wypełnij formularze partnerskie i wyślij na nasz adres e-mail. Propozycja zostanie rozpatrzona na najbliższym posiedzeniu Zarządu Głównego." data-en="Student Scientific Circles can partner with us. Fill out the partnership forms and send them to our email. The proposal will be reviewed at the next Main Board meeting.">
                Studenckie Koła Naukowe mogą nawiązać z nami współpracę. Wypełnij formularze partnerskie i wyślij na nasz adres e-mail. Propozycja zostanie rozpatrzona na najbliższym posiedzeniu Zarządu Głównego.
              </p>
              <a href="mailto:studenckiestowarzyszeniekardio@gmail.com" className="btn btn-primary" data-pl="Skontaktuj się" data-en="Get in touch">Skontaktuj się</a>
            </div>
            <div className="coop-image">
              <Image src="/img/cooperation.webp" alt="Cooperation" width={600} height={400} style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 350 }} />
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <FAQ />

      {/* ============ FOOTER ============ */}
      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Image src="/img/logo.webp" alt="SSK Logo" width={56} height={56} className="footer-logo" />
              <h3>Studenckie Stowarzyszenie<br />Kardiologiczne</h3>
              <p data-pl="Łączymy studentów z pasją do kardiologii." data-en="Uniting students with a passion for cardiology.">
                Łączymy studentów z pasją do kardiologii.
              </p>
            </div>
            <div className="footer-col">
              <h4 data-pl="Nawigacja" data-en="Navigation">Nawigacja</h4>
              <ul>
                <li><a href="#about" data-pl="O nas" data-en="About">O nas</a></li>
                <li><a href="#events" data-pl="Wydarzenia" data-en="Events">Wydarzenia</a></li>
                <li><a href="#team" data-pl="Zespół" data-en="Team">Zespół</a></li>
                <li><a href="#join" data-pl="Dołącz" data-en="Join">Dołącz</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 data-pl="Dane rejestrowe" data-en="Registration Data">Dane rejestrowe</h4>
              <ul className="footer-data">
                <li><strong>NIP:</strong> 5223313454</li>
                <li><strong>KRS:</strong> 0001130618</li>
                <li><strong>REGON:</strong> 529834862</li>
                <li data-pl="ul. 1 Maja 6/61, 02-495 Warszawa" data-en="1 Maja 6/61 St., 02-495 Warsaw">ul. 1 Maja 6/61, 02-495 Warszawa</li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 data-pl="Znajdź nas" data-en="Find Us">Znajdź nas</h4>
              <div className="social-links">
                <a href="https://www.facebook.com/profile.php?id=61563630476411" target="_blank" rel="noopener" aria-label="Facebook" className="social-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.instagram.com/studenckie_kardio/" target="_blank" rel="noopener" aria-label="Instagram" className="social-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://www.linkedin.com/company/studenckie-stowarzyszenie-kardiologiczne" target="_blank" rel="noopener" aria-label="LinkedIn" className="social-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
              <a href="mailto:studenckiestowarzyszeniekardio@gmail.com" className="footer-email">studenckiestowarzyszeniekardio@gmail.com</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Studenckie Stowarzyszenie Kardiologiczne. <span data-pl="Wszelkie prawa zastrzeżone." data-en="All rights reserved.">Wszelkie prawa zastrzeżone.</span></p>
          </div>
        </div>
      </footer>
    </>
  );
}
