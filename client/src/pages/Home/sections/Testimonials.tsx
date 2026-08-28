import { Section, Container } from '../../../components/layout/Section';
import { SectionHeader } from '../../../components/layout/SectionHeader';
import { TestimonialWall } from '../../../components/common/TestimonialWall';

/** H9 / §9.11 — human evidence. The second permitted centred moment. */
export function Testimonials() {
  return (
    <Section surface="carbon" className="testimonials" aria-labelledby="wall-title">
      <Container>
        <SectionHeader
          eyebrow="In their words"
          headline={['Twelve clients, asked directly.']}
          id="wall-title"
          align="center"
        />
        <TestimonialWall initial={5} />
      </Container>
    </Section>
  );
}
