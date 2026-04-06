'use client';
import { useState } from 'react';
import { IconChevronDown } from '@/components/icons';
import SectionReveal from '@/components/ui/SectionReveal';
import styles from './FaqSection.module.css';
import type { FaqItem } from '@/lib/admin-api';

export default function FaqSection({ faqs, showHeader = true }: { faqs: FaqItem[]; showHeader?: boolean }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <section id="faq" className={`section ${styles.section}`} aria-labelledby="faq-heading">
      <div className="container">
        <div className={styles.inner}>
          {showHeader ? (
            <SectionReveal className={styles.header}>
              <span className="section-label">Common Questions</span>
              <h2 id="faq-heading" className="section-title">Frequently Asked</h2>
              <p className="section-body">
                Straightforward answers to the questions clients ask before engaging
                a professional security service.
              </p>
            </SectionReveal>
          ) : null}

          <div className={styles.accordion} role="list">
            {faqs.map((faq, i) => {
              const isOpen = openId === faq.id;
              return (
                <SectionReveal
                  key={faq.id}
                  delay={i * 50}
                  className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}
                  role="listitem"
                >
                  <button
                    className={styles.question}
                    onClick={() => toggle(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                    id={`faq-btn-${faq.id}`}
                  >
                    <span className={styles.questionText}>{faq.question}</span>
                    <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} aria-hidden="true">
                      <IconChevronDown size={16} />
                    </span>
                  </button>

                  <div
                    id={`faq-answer-${faq.id}`}
                    role="region"
                    aria-labelledby={`faq-btn-${faq.id}`}
                    className={`${styles.answer} ${isOpen ? styles.answerOpen : ''}`}
                  >
                    <p className={styles.answerText}>{faq.answer}</p>
                  </div>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
