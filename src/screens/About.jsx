import { Link } from 'react-router-dom';
import ElizabethCharacter from '../components/ElizabethCharacter.jsx';

export default function About() {
  return (
    <main className="min-h-screen p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/"
          className="text-green-700 font-semibold min-h-[48px] min-w-[48px] flex items-center"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">About Us</h1>
        <div className="w-12" />
      </div>

      {/* Elizabeth hero */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <ElizabethCharacter mood="waving" size={120} />
        <div className="bg-white/80 rounded-2xl rounded-bl-sm shadow-sm p-4 max-w-sm">
          <p className="text-sm leading-relaxed">Hi! I'm Elizabeth! Let me tell you how this all started...</p>
        </div>
      </div>

      {/* Elizabeth's story */}
      <div className="space-y-4 mb-10">
        <p className="text-lg font-bold">Hi, I'm Elizabeth! 👋</p>

        <p className="leading-relaxed">
          I'm in Year 6 and this year I'm doing my SATs. When my dad and I started looking
          at ways to practise my spelling, we couldn't find anything that was actually <em>fun</em>.
          Most of the apps and websites felt like boring worksheets on a screen. No thanks!
        </p>

        <p className="leading-relaxed">
          So we decided to build our own.
        </p>

        <p className="leading-relaxed">
          My dad does the techy stuff and I'm the chief tester (and complainer when something
          isn't good enough!). I love animals, so we made it into a wildlife adventure where you
          discover cool creatures by getting your spellings and maths right.
        </p>

        <p className="leading-relaxed">
          I also have dyslexia, which means some words look a bit jumbled up to me. So we made
          sure everything in the app is designed to make reading and spelling easier — bigger text,
          friendly fonts, and you always <em>hear</em> the word before you have to spell it. No tricks,
          no stress!
        </p>

        <p className="leading-relaxed">
          Then we thought — if we can make spelling fun, why not maths too? So we built a whole
          maths section with fractions, decimals, and percentages, with step-by-step help when
          you get stuck. It even adjusts to how well you're doing, so it's never too easy or
          too hard.
        </p>

        <p className="leading-relaxed">
          We had so much fun building it that we thought — why keep it to ourselves? Other kids
          doing their SATs might like it too!
        </p>

        <p className="leading-relaxed">
          So here it is. <strong>Brightleap.</strong> Spelling, maths, and more — built by a dad
          and his daughter, for everyone.
        </p>

        <p className="leading-relaxed">
          I hope you love it as much as I do. And if you have any ideas for making it better,
          we'd love to hear them!
        </p>

        <p className="leading-relaxed">
          Happy exploring!
          <br />
          <strong>Elizabeth</strong> ✨
        </p>
      </div>

      {/* For parents and teachers */}
      <div className="p-6 bg-white/80 rounded-2xl shadow-sm mb-8">
        <h2 className="font-bold text-lg mb-3">For Parents and Teachers</h2>

        <div className="space-y-3 leading-relaxed text-gray-600">
          <p>
            Brightleap was built with dyslexia-friendly design at its heart. Every feature —
            from the audio-first spelling approach to the customisable fonts and colours — is
            informed by research into how children with dyslexia learn best.
          </p>

          <p>
            <strong>English:</strong> The spelling content covers all Year 3–6 spelling rules
            tested in the KS2 SATs. The app uses spaced repetition to bring back tricky words
            at the right time, and our mock SATs tests use words from real STA past papers
            (2018–2023) in the authentic Paper 2 format.
          </p>

          <p>
            <strong>Maths:</strong> Over 330 questions across fractions, decimals, and
            percentages — the topics that make up the bulk of KS2 SATs marks. Three learning
            trails (SATs Essentials, Year 3/4, and Year 5/6) with adaptive difficulty that
            responds to your child's performance. Step-by-step worked examples break down
            every wrong answer so children understand <em>why</em>, not just <em>what</em>.
            A full mock SATs maths test covers both Paper 1 (Arithmetic) and Paper 2 (Reasoning).
          </p>

          <p>
            We collect the minimum data possible and follow the ICO's Children's Code. No ads,
            no tricks, no dark patterns. Just learning that feels like play.
          </p>

          <p>
            <Link to="/our-approach" className="text-green-700 font-semibold underline">
              Read about the science behind Brightleap →
            </Link>
          </p>

          <p className="text-gray-600">
            If you'd like to know more, get in touch at{' '}
            <span className="text-green-700 font-semibold">hello@brightleap.co.uk</span>
          </p>
        </div>
      </div>

      {/* Back button */}
      <div className="text-center">
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
