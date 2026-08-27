import { ContactHero } from '../sections/contact/ContactHero';
import { ContactForm } from '../sections/contact/ContactForm';
import { ContactDetails } from '../sections/contact/ContactDetails';
import { Process } from '../sections/contact/Process';
import { TrustBand } from '../sections/contact/TrustBand';
import { ContactFaq } from '../sections/contact/ContactFaq';

/**
 * Contact page — seven blocks, the same visual system and motion tokens as the
 * homepage, and one dark moment instead of two. It should feel like the
 * natural continuation of the homepage, not a different site.
 */
export default function ContactPage() {
  return (
    <>
      <ContactHero />

      <section className="section contact-main bg-white" aria-label="Request an audit" data-bg="white">
        <div className="container contact-main__grid">
          <div className="contact-main__form">
            <ContactForm />
          </div>
          <ContactDetails />
        </div>
      </section>

      <Process />
      <TrustBand />
      <ContactFaq />
    </>
  );
}
