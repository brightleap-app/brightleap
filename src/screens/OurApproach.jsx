import { Link } from 'react-router-dom';
import ElizabethCharacter from '../components/ElizabethCharacter.jsx';

export default function OurApproach() {
  return (
    <main className="min-h-screen p-6 max-w-prose mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/about"
          className="text-green-700 font-semibold min-h-[48px] min-w-[48px] flex items-center"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">The Science Behind Brightleap</h1>
        <div className="w-12" />
      </div>

      {/* Hero */}
      <div className="flex items-center gap-4 mb-8 p-4 bg-green-50 rounded-2xl">
        <ElizabethCharacter mood="thinking" size={80} />
        <p className="text-sm text-green-800 leading-relaxed">
          Every feature in Brightleap is backed by research. Here's why we built it the way we did.
        </p>
      </div>

      {/* Structured Literacy */}
      <Section
        number="1"
        title="Structured Literacy, Not Rote Learning"
        icon="📚"
      >
        <p>
          Research consistently shows that effective spelling instruction for children with dyslexia
          must be <strong>systematic, explicit, and component-based</strong>. Meta-analyses confirm
          that approaches integrating phonics, orthographic rules, and morphological instruction
          yield significantly better outcomes than memorisation-based methods.
        </p>
        <p>
          Brightleap teaches spelling through structured patterns — prefixes, suffixes, silent
          letters, homophones — rather than asking children to memorise word lists. Each habitat
          focuses on a specific spelling rule, building understanding of <em>why</em> words are
          spelled the way they are.
        </p>
        <Evidence>
          Galuschka et al. (2014) meta-analysis; Orton-Gillingham structured approach;
          UK Rose Review; International Dyslexia Association Structured Literacy framework
        </Evidence>
      </Section>

      {/* Audio-First */}
      <Section
        number="2"
        title="Audio-First: Retrieval Practice, Not Recognition"
        icon="🔊"
      >
        <p>
          In Brightleap, children always <strong>hear the word before they see it</strong>. This
          is deliberate. Hearing a word and then spelling it from memory is <em>retrieval
          practice</em> — one of the most powerful learning techniques identified by cognitive
          science. It forces the brain to actively reconstruct the spelling rather than passively
          recognise it.
        </p>
        <p>
          Showing the word first would test recognition, not recall. Recognition is easier but
          produces weaker learning. By making children retrieve the spelling from memory, we
          create stronger, more durable neural pathways — exactly what's needed for SATs
          performance.
        </p>
        <Evidence>
          Roediger & Butler (2011) testing effect; Karpicke & Blunt (2011) retrieval practice;
          Dunlosky et al. (2013) effective learning strategies
        </Evidence>
      </Section>

      {/* Spaced Repetition */}
      <Section
        number="3"
        title="Spaced Repetition: The Right Word at the Right Time"
        icon="🔄"
      >
        <p>
          Brightleap uses a <strong>spaced repetition algorithm</strong> to determine when each
          word should reappear. Words the child struggles with come back sooner and more
          frequently. Words they've mastered are spaced out over longer intervals.
        </p>
        <p>
          This approach is based on the <em>spacing effect</em> — one of the most robust findings
          in memory research. Distributing practice over time produces significantly better
          long-term retention than massed practice (cramming). For children with dyslexia, who
          often require more repetitions to achieve mastery, this is particularly important.
        </p>
        <Evidence>
          Ebbinghaus spacing effect; Cepeda et al. (2006) spacing meta-analysis;
          Leitner spaced repetition system; Pimsleur graduated interval recall
        </Evidence>
      </Section>

      {/* Dyslexia-Friendly Design */}
      <Section
        number="4"
        title="Dyslexia-Friendly Design by Default"
        icon="🎨"
      >
        <p>
          Every visual design choice in Brightleap follows evidence-based accessibility
          guidelines for dyslexic readers:
        </p>
        <ul className="list-disc ml-6 space-y-2 mt-3">
          <li><strong>Font choice:</strong> Clean sans-serif fonts with the option to switch to OpenDyslexic. Research shows simple, well-spaced sans-serif fonts benefit all readers, including those with dyslexia.</li>
          <li><strong>Customisable spacing:</strong> Adjustable line height, letter spacing, and text size. Studies show increased spacing improves reading speed and accuracy for dyslexic readers.</li>
          <li><strong>Soft backgrounds:</strong> Cream, soft blue, and soft green options. Research indicates that off-white backgrounds can reduce visual stress for some readers.</li>
          <li><strong>Left-aligned text:</strong> Never justified. Justified text creates uneven word spacing that disrupts tracking for dyslexic readers.</li>
          <li><strong>Short line lengths:</strong> Maximum ~60 characters per line to reduce tracking errors.</li>
          <li><strong>No time pressure:</strong> No countdown timers on learning activities. Time pressure increases anxiety and impairs retrieval in dyslexic learners.</li>
        </ul>
        <Evidence>
          British Dyslexia Association style guide; WCAG 2.1 cognitive accessibility guidelines;
          Zorzi et al. (2012) extra-large letter spacing study; Rello & Baeza-Yates (2013)
          typography research
        </Evidence>
      </Section>

      {/* SATs Alignment */}
      <Section
        number="5"
        title="Rigorous SATs Curriculum Alignment"
        icon="🎓"
      >
        <p>
          Brightleap's content is mapped directly to the <strong>KS2 National Curriculum</strong>
          across both English and maths.
        </p>
        <p className="mt-3 font-semibold">English — Spelling</p>
        <p>
          The 8 habitat categories cover the core spelling rules tested at Year 5/6 level:
        </p>
        <ul className="list-disc ml-6 space-y-1 mt-3 text-sm">
          <li>Words with the /i/ sound spelt 'y'</li>
          <li>Words ending in -tion, -sion, -ssion</li>
          <li>Words with the suffix -ous</li>
          <li>Words with the suffix -ly</li>
          <li>Words with silent letters</li>
          <li>Year 5/6 statutory word list</li>
          <li>Words with prefixes</li>
          <li>Homophones and commonly confused words</li>
        </ul>
        <p className="mt-3">
          Mock spelling tests use <strong>real words from published STA (Standards and Testing Agency) past papers</strong>
          (2018–2023), presented in the authentic Paper 2 format: sentence read aloud, target
          word spoken, sentence repeated.
        </p>
        <p className="mt-3 font-semibold">Maths — Fractions, Decimals &amp; Percentages</p>
        <p>
          Three learning trails cover the progression from Year 3 foundations to Year 6 SATs-level
          problem solving:
        </p>
        <ul className="list-disc ml-6 space-y-1 mt-3 text-sm">
          <li><strong>SATs Essentials:</strong> Identifying, comparing, simplifying, adding and subtracting fractions; decimal equivalents; percentages</li>
          <li><strong>Year 3/4:</strong> Recognising fractions, counting in tenths, same-denominator operations, early decimal understanding</li>
          <li><strong>Year 5/6:</strong> Different-denominator operations, multiplying and dividing fractions, decimal and percentage reasoning, SATs-style word problems</li>
        </ul>
        <p className="mt-3">
          Mock maths tests mirror the real SATs format with <strong>Paper 1 (Arithmetic)</strong> and
          <strong> Paper 2 (Reasoning)</strong>, giving children authentic test-day experience.
        </p>
        <Evidence>
          STA KS2 English GPS framework; National Curriculum Year 5/6 word list;
          STA past papers 2018, 2019, 2022, 2023; National Curriculum mathematics
          programmes of study (Years 3–6); STA KS2 Mathematics test framework
        </Evidence>
      </Section>

      {/* Maths: Adaptive Difficulty */}
      <Section
        number="6"
        title="Adaptive Maths: Meeting Every Child Where They Are"
        icon="📐"
      >
        <p>
          Brightleap's maths section covers <strong>fractions, decimals, and percentages</strong> —
          the topics that together account for the majority of marks in the KS2 SATs maths papers.
          Over 330 questions are organised across three trails: SATs Essentials, Year 3/4, and
          Year 5/6, mapped directly to the National Curriculum programmes of study.
        </p>
        <p>
          The app uses an <strong>adaptive difficulty engine</strong> that responds to each child's
          performance in real time. Three correct answers in a row and the difficulty increases;
          two incorrect and it steps back down. This keeps children working in their <em>zone
          of proximal development</em> — the sweet spot identified by Vygotsky where learning
          is challenging enough to promote growth but not so hard that it causes frustration.
        </p>
        <p>
          For children with dyslexia, who often experience maths anxiety linked to reading
          difficulties in word problems, this gradual scaffolding is particularly important. The
          system never jumps more than one level at a time, building confidence through steady
          progression.
        </p>
        <Evidence>
          Vygotsky (1978) zone of proximal development; Tomlinson (2001) differentiated instruction;
          EEF Mathematics Guidance (2020); Ashcraft & Moore (2009) maths anxiety and working memory
        </Evidence>
      </Section>

      {/* Maths: Worked Examples */}
      <Section
        number="7"
        title="Step-by-Step Worked Examples"
        icon="📝"
      >
        <p>
          When a child answers a maths question incorrectly, Brightleap doesn't simply show the
          right answer. Instead, it presents a <strong>detailed worked example</strong> that breaks
          the problem down into clear, numbered steps. This approach is grounded in
          cognitive load theory — by reducing the mental effort needed to process a solution,
          worked examples free up working memory for genuine understanding.
        </p>
        <p>
          Research shows that worked examples are particularly effective for novice learners and
          those with limited working memory — a common challenge for children with dyslexia.
          The step-by-step format also supports the <em>concrete–representational–abstract</em>
          (CRA) progression recommended by the EEF, moving from visual models to formal methods.
        </p>
        <p>
          Our mock SATs maths tests cover both <strong>Paper 1 (Arithmetic)</strong> and
          <strong> Paper 2 (Reasoning)</strong>, giving children authentic practice with the
          exact format they'll encounter on test day — including word problems that require
          careful reading and multi-step problem solving.
        </p>
        <Evidence>
          Sweller (1988) cognitive load theory; Atkinson et al. (2000) worked example effect;
          EEF Mathematics Guidance (2020) CRA approach; Gathercole & Alloway (2008) working
          memory and learning
        </Evidence>
      </Section>

      {/* Gamification */}
      <Section
        number="8"
        title="Ethical Gamification: Motivation Without Manipulation"
        icon="🎮"
      >
        <p>
          Gamification can be a powerful tool for maintaining engagement, but it must be designed
          carefully — especially for children. Research distinguishes between gamification that
          enhances <em>intrinsic motivation</em> (genuine interest and mastery) and designs that
          exploit <em>extrinsic motivation</em> through manipulative reward loops.
        </p>
        <p>Brightleap's gamification is designed to:</p>
        <ul className="list-disc ml-6 space-y-2 mt-3">
          <li><strong>Reward effort and persistence</strong>, not just accuracy — XP is earned for every attempt</li>
          <li><strong>Celebrate progress</strong> through explorer levels that reflect cumulative learning</li>
          <li><strong>Encourage natural stopping points</strong> — sessions end with encouragement, not pressure to continue</li>
          <li><strong>Avoid shame</strong> — wrong answers highlight "tricky parts" and offer warm encouragement, never punitive language</li>
          <li><strong>No public leaderboards</strong> — comparison with others can be damaging for struggling learners</li>
          <li><strong>No artificial scarcity</strong> — no lives, no energy systems, no pay-to-progress mechanics</li>
        </ul>
        <Evidence>
          Ryan & Deci (2000) Self-Determination Theory; Hamari et al. (2014) gamification
          meta-analysis; ICO Children's Code on manipulative design;
          5Rights Foundation on children's digital design
        </Evidence>
      </Section>

      {/* Warm Feedback */}
      <Section
        number="9"
        title="Warm, Encouraging Feedback"
        icon="💬"
      >
        <p>
          Children with dyslexia often experience years of negative feedback around spelling and
          reading. Research on <em>learned helplessness</em> shows that repeated failure without
          support leads to disengagement and avoidance. Brightleap's feedback model is designed
          to break this cycle:
        </p>
        <ul className="list-disc ml-6 space-y-2 mt-3">
          <li>Wrong answers are never labelled "wrong" or "incorrect" — we use "nearly" and "let's look at the tricky part"</li>
          <li>Tricky letters are highlighted in amber, not red — colour psychology matters</li>
          <li>Every answer earns acknowledgement; correct answers earn celebration</li>
          <li>Elizabeth, the helper character, uses peer-to-peer language (she's the same age as the user)</li>
          <li>The diagnostic assessment uses neutral "Got it! Next word..." feedback, not scores</li>
        </ul>
        <Evidence>
          Dweck (2006) growth mindset; Seligman learned helplessness theory;
          Burden (2005) dyslexia and self-esteem; BDA emotional impact of dyslexia
        </Evidence>
      </Section>

      {/* Data Ethics */}
      <Section
        number="10"
        title="Data Ethics and Child Safety"
        icon="🔒"
      >
        <p>
          Brightleap is designed in full compliance with the <strong>ICO Children's Code</strong>
          (Age Appropriate Design Code) and UK GDPR requirements for children's services:
        </p>
        <ul className="list-disc ml-6 space-y-2 mt-3">
          <li><strong>Data minimisation:</strong> We collect only what's needed — parent email, child's first name, and learning progress. No date of birth, surname, school, or location.</li>
          <li><strong>Privacy by default:</strong> No profiling, no data sharing with third parties, no advertising.</li>
          <li><strong>Parental consent:</strong> Clear consent statement during registration explaining exactly what data is collected and why.</li>
          <li><strong>No manipulative design:</strong> No nudging toward data sharing, no dark patterns, no hidden costs.</li>
          <li><strong>Transparency:</strong> All data practices are explained in plain language that a child can understand.</li>
          <li><strong>Right to erasure:</strong> All data can be deleted from Settings at any time.</li>
        </ul>
        <Evidence>
          ICO Age Appropriate Design Code (2020); UK GDPR Article 8;
          5Rights Foundation design standards; UNICEF responsible innovation framework
        </Evidence>
      </Section>

      {/* Footer */}
      <div className="mt-10 p-6 bg-white/80 rounded-2xl shadow-sm text-center">
        <p className="text-sm text-gray-600 mb-4">
          The full research foundation for Brightleap spans over 50 pages covering dyslexia
          pedagogy, learning science, mathematics education, UX accessibility, curriculum
          alignment, gamification ethics, and child safeguarding. Every design decision is
          documented and traceable to its evidence base.
        </p>
        <p className="text-sm text-gray-600">
          For academic enquiries or to request the full research report, contact{' '}
          <span className="text-green-700 font-semibold">hello@brightleap.co.uk</span>
        </p>
      </div>

      <div className="text-center mt-8 mb-4">
        <Link
          to="/"
          className="inline-block px-8 py-4 bg-green-600 text-white rounded-2xl text-lg font-semibold hover:bg-green-700 transition-colors min-h-[48px]"
        >
          Back to exploring!
        </Link>
      </div>
    </main>
  );
}

// Reusable section component
function Section({ number, title, icon, children }) {
  return (
    <section className="mb-10">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <div className="space-y-3 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

// Evidence citation block
function Evidence({ children }) {
  return (
    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-sm text-blue-700">
        <strong>Evidence base:</strong> {children}
      </p>
    </div>
  );
}
