"use client";

import { useState } from "react";

interface FaqItem {
  questionPl: string;
  questionEn: string;
  answerPl: string;
  answerEn: string;
}

const DEFAULT_FAQ: FaqItem[] = [
  {
    questionPl: "Dlaczego stowarzyszenie, a nie koło naukowe?",
    questionEn: "Why an association and not a scientific circle?",
    answerPl: "Stowarzyszenie daje nam niezależność prawną i możliwość działania międzyuczelnianego. Jako zarejestrowany podmiot w KRS, możemy formalnie współpracować z ośrodkami akademickimi, pozyskiwać sponsorów i organizować ogólnopolskie wydarzenia.",
    answerEn: "An association gives us legal independence and the ability to operate across universities. As a registered entity in the National Court Register (KRS), we can formally collaborate with academic centers, attract sponsors, and organize nationwide events.",
  },
  {
    questionPl: "Kto może dołączyć do SSK?",
    questionEn: "Who can join SSK?",
    answerPl: "Studenci wszystkich kierunków medycznych i ścisłych oraz osoby do 3 lat od ukończenia studiów. Nie musisz studiować medycyny \u2014 wystarczy pasja do kardiologii!",
    answerEn: "Students of all medical and science fields, and graduates up to 3 years after completing their studies. You don\u2019t have to study medicine \u2014 a passion for cardiology is enough!",
  },
  {
    questionPl: "Ile kosztuje członkostwo?",
    questionEn: "How much does membership cost?",
    answerPl: "Roczna składka członkowska wynosi 50 zł. Zapewnia ona dostęp do wszystkich wydarzeń, warsztatów i materiałów edukacyjnych.",
    answerEn: "The annual membership fee is 50 PLN. It provides access to all events, workshops, and educational materials.",
  },
  {
    questionPl: "Jak wygląda współpraca z kołami naukowymi?",
    questionEn: "How does cooperation with scientific circles work?",
    answerPl: "SKN mogą nawiązać formalną współpracę poprzez wypełnienie formularzy partnerskich i przesłanie ich na nasz adres e-mail. Każda propozycja jest rozpatrywana na posiedzeniu Zarządu Głównego.",
    answerEn: "Student Scientific Circles can establish formal cooperation by filling out partnership forms and sending them to our email. Each proposal is reviewed at a Main Board meeting.",
  },
  {
    questionPl: "Czy SSK działa tylko w Warszawie?",
    questionEn: "Does SSK only operate in Warsaw?",
    answerPl: "Nie \u2014 SSK zrzesza studentów z ponad 15 uczelni medycznych z całej Polski. Spotkania online organizujemy regularnie, a warsztaty stacjonarne odbywają się w różnych miastach \u2014 m.in. Warszawie, Gdańsku i Wrocławiu.",
    answerEn: "No \u2014 SSK brings together students from over 15 medical universities across Poland. We organize regular online meetings, and in-person workshops take place in various cities \u2014 including Warsaw, Gda\u0144sk, and Wroc\u0142aw.",
  },
  {
    questionPl: "Jak często odbywają się wydarzenia?",
    questionEn: "How often do events take place?",
    answerPl: "Spotkania edukacyjne online organizujemy co miesiąc. Warsztaty praktyczne ECHO i EKG, szkoły letnie i konferencje \u2014 kilka razy w roku. Śledź nasz Facebook i Instagram, żeby nie przegapić terminów.",
    answerEn: "We hold educational online meetings monthly. Hands-on ECHO and ECG workshops, summer schools, and conferences take place several times a year. Follow our Facebook and Instagram to stay up to date.",
  },
  {
    questionPl: "Czy muszę studiować medycynę, żeby dołączyć?",
    questionEn: "Do I need to study medicine to join?",
    answerPl: "Nie. Zapraszamy studentów wszystkich kierunków medycznych i ścisłych \u2014 lekarskiego, pielęgniarstwa, fizjoterapii, biomedycyny, biotechnologii i wielu innych. Liczy się zainteresowanie kardiologią.",
    answerEn: "No. We welcome students from all medical and science fields \u2014 medicine, nursing, physiotherapy, biomedicine, biotechnology, and many more. What matters is your interest in cardiology.",
  },
  {
    questionPl: "Jak się zapisać?",
    questionEn: "How do I sign up?",
    answerPl: `Wypełnij formularz zg\u0142oszeniowy online (link w sekcji \u201EDo\u0142\u0105cz do nas\u201D), op\u0142a\u0107 sk\u0142adk\u0119 cz\u0142onkowsk\u0105 (50 z\u0142/rok) i czekaj na potwierdzenie. Ca\u0142y proces zajmuje kilka minut.`,
    answerEn: "Fill out the online application form (link in the \u2018Join Us\u2019 section), pay the membership fee (50 PLN/year), and wait for confirmation. The whole process takes just a few minutes.",
  },
];

export default function FAQ({ items }: { items?: FaqItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const faqData = items && items.length > 0 ? items : DEFAULT_FAQ;

  const toggle = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="section faq" id="faq">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">FAQ</span>
          <h2 data-pl="Najcz\u0119\u015Bciej zadawane pytania" data-en="Frequently Asked Questions">
            Najczęściej zadawane pytania
          </h2>
        </div>
        <div className="faq-list">
          {faqData.map((item, i) => (
            <div key={i} className={`faq-item${activeIndex === i ? " active" : ""}`}>
              <button className="faq-question" onClick={() => toggle(i)}>
                <span data-pl={item.questionPl} data-en={item.questionEn}>
                  {item.questionPl}
                </span>
                <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
