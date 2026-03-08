"use client";

import { useState } from "react";

const faqData = [
  {
    questionPl: "Dlaczego stowarzyszenie, a nie koło naukowe?",
    questionEn: "Why an association and not a scientific circle?",
    answerPl:
      "Stowarzyszenie daje nam niezależność prawną i możliwość działania międzyuczelnianego. Jako zarejestrowany podmiot w KRS, możemy formalnie współpracować z ośrodkami akademickimi, pozyskiwać sponsorów i organizować ogólnopolskie wydarzenia.",
    answerEn:
      "An association gives us legal independence and the ability to operate across universities. As a registered entity in the National Court Register (KRS), we can formally collaborate with academic centers, attract sponsors, and organize nationwide events.",
  },
  {
    questionPl: "Kto może dołączyć do SSK?",
    questionEn: "Who can join SSK?",
    answerPl:
      "Studenci wszystkich kierunków medycznych i ścisłych oraz osoby do 3 lat od ukończenia studiów. Nie musisz studiować medycyny — wystarczy pasja do kardiologii!",
    answerEn:
      "Students of all medical and science fields, and graduates up to 3 years after completing their studies. You don't have to study medicine — a passion for cardiology is enough!",
  },
  {
    questionPl: "Ile kosztuje członkostwo?",
    questionEn: "How much does membership cost?",
    answerPl:
      "Roczna składka członkowska wynosi 50 zł. Zapewnia ona dostęp do wszystkich wydarzeń, warsztatów i materiałów edukacyjnych.",
    answerEn:
      "The annual membership fee is 50 PLN. It provides access to all events, workshops, and educational materials.",
  },
  {
    questionPl: "Jak wygląda współpraca z kołami naukowymi?",
    questionEn: "How does cooperation with scientific circles work?",
    answerPl:
      "SKN mogą nawiązać formalną współpracę poprzez wypełnienie formularzy partnerskich i przesłanie ich na nasz adres e-mail. Każda propozycja jest rozpatrywana na posiedzeniu Zarządu Głównego.",
    answerEn:
      "Student Scientific Circles can establish formal cooperation by filling out partnership forms and sending them to our email. Each proposal is reviewed at a Main Board meeting.",
  },
  {
    questionPl: "Czy SSK działa tylko w Warszawie?",
    questionEn: "Does SSK only operate in Warsaw?",
    answerPl:
      "Nie — SSK zrzesza studentów z ponad 15 uczelni medycznych z całej Polski. Spotkania online organizujemy regularnie, a warsztaty stacjonarne odbywają się w różnych miastach — m.in. Warszawie, Gdańsku i Wrocławiu.",
    answerEn:
      "No — SSK brings together students from over 15 medical universities across Poland. We organize regular online meetings, and in-person workshops take place in various cities — including Warsaw, Gdańsk, and Wrocław.",
  },
  {
    questionPl: "Jak często odbywają się wydarzenia?",
    questionEn: "How often do events take place?",
    answerPl:
      "Spotkania edukacyjne online organizujemy co miesiąc. Warsztaty praktyczne ECHO i EKG, szkoły letnie i konferencje — kilka razy w roku. Śledź nasz Facebook i Instagram, żeby nie przegapić terminów.",
    answerEn:
      "We hold educational online meetings monthly. Hands-on ECHO and ECG workshops, summer schools, and conferences take place several times a year. Follow our Facebook and Instagram to stay up to date.",
  },
  {
    questionPl: "Czy muszę studiować medycynę, żeby dołączyć?",
    questionEn: "Do I need to study medicine to join?",
    answerPl:
      "Nie. Zapraszamy studentów wszystkich kierunków medycznych i ścisłych — lekarskiego, pielęgniarstwa, fizjoterapii, biomedycyny, biotechnologii i wielu innych. Liczy się zainteresowanie kardiologią.",
    answerEn:
      "No. We welcome students from all medical and science fields — medicine, nursing, physiotherapy, biomedicine, biotechnology, and many more. What matters is your interest in cardiology.",
  },
  {
    questionPl: "Jak się zapisać?",
    questionEn: "How do I sign up?",
    answerPl:
      'Wypełnij formularz zgłoszeniowy online (link w sekcji „Dołącz do nas"), opłać składkę członkowską (50 zł/rok) i czekaj na potwierdzenie. Cały proces zajmuje kilka minut.',
    answerEn:
      "Fill out the online application form (link in the 'Join Us' section), pay the membership fee (50 PLN/year), and wait for confirmation. The whole process takes just a few minutes.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="section faq" id="faq">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">FAQ</span>
          <h2
            data-pl="Najczęściej zadawane pytania"
            data-en="Frequently Asked Questions"
          >
            Najczęściej zadawane pytania
          </h2>
        </div>
        <div className="faq-list">
          {faqData.map((item, i) => (
            <div
              key={i}
              className={`faq-item${activeIndex === i ? " active" : ""}`}
            >
              <button className="faq-question" onClick={() => toggle(i)}>
                <span data-pl={item.questionPl} data-en={item.questionEn}>
                  {item.questionPl}
                </span>
                <svg
                  className="faq-chevron"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div className="faq-answer">
                <p data-pl={item.answerPl} data-en={item.answerEn}>
                  {item.answerPl}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
