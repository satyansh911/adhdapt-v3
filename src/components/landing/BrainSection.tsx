interface Card {
  title: string;
  body: string;
  accent: string;
  color: string;
  img: string;
}

const CARDS: Card[] = [
  {
    title: "The Noise is Real",
    body: "Your brain feels like it's juggling 50 tabs — all open, all urgent. ADHD isn't laziness; it's managing too much at once.",
    accent: "We help you quiet the noise.",
    color: "#F5B000",
    img: "/home/image1.jpg",
  },
  {
    title: "You Can Find Focus",
    body: "You're creative, emotional, passionate. Focus isn't out of reach — it takes the right tools, rhythm, and kindness to self.",
    accent: "ADHDapt helps you build that.",
    color: "#2D8EFF",
    img: "/home/image2.jpg",
  },
  {
    title: "Not Broken, Just Wired Differently",
    body: "Forgetfulness, distraction, overthinking — you're not “bad at life.” Your mind is a maze of brilliance.",
    accent: "We help you navigate, not fix you.",
    color: "#ED1C24",
    img: "/home/image3.jpg",
  },
  {
    title: "You Deserve Rest, Too",
    body: "You don't have to earn rest by finishing everything. ADHDapt helps you work with your energy, not against it.",
    accent: "Pause, recharge, and breathe.",
    color: "#8acfd1",
    img: "/home/image4.jpg",
  },
];

/** `imageSide` = which side the photo sits on; the text hugs the opposite side. */
function InfoCard({ card, imageSide }: { card: Card; imageSide: "left" | "right" }) {
  const image = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={card.img}
      alt={card.title}
      className="h-32 w-32 flex-shrink-0 rounded-2xl object-cover sm:h-36 sm:w-36"
      loading="lazy"
    />
  );
  const text = (
    <div className={imageSide === "left" ? "text-left" : "text-right"}>
      <h3 className="text-[15px] font-extrabold leading-tight" style={{ color: card.color }}>{card.title}</h3>
      <p className="mt-1 text-[12px] leading-snug text-[#a8a5b0]">{card.body}</p>
      <p className="mt-1.5 text-[12px] font-bold" style={{ color: card.color }}>{card.accent}</p>
    </div>
  );

  return (
    <div className="hoverable flex items-center gap-4 rounded-2xl border border-white/10 bg-[#17171b] p-4">
      {imageSide === "left" ? (
        <>
          {image}
          {text}
        </>
      ) : (
        <>
          {text}
          {image}
        </>
      )}
    </div>
  );
}

export default function BrainSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14 text-center">
      <h2 className="font-display text-4xl font-extrabold md:text-5xl">Your brain isn&apos;t broken.</h2>
      <p className="mx-auto mt-3 max-w-lg text-[15px] font-medium text-[#a8a5b0]">
        It just needs tools that speak its language. Here&apos;s the reframe.
      </p>

      {/* Mobile: single column, photos alternating left / right, no brain. */}
      <div className="mt-8 flex flex-col gap-4 lg:hidden">
        {CARDS.map((card, i) => (
          <InfoCard key={card.title} card={card} imageSide={i % 2 === 0 ? "left" : "right"} />
        ))}
      </div>

      {/* Desktop: two columns flanking the brain. */}
      <div className="mt-10 hidden items-center gap-5 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <div className="flex flex-col gap-5">
          <InfoCard card={CARDS[0]} imageSide="right" />
          <InfoCard card={CARDS[2]} imageSide="right" />
        </div>

        <div className="flex justify-center">
          <div className="flex h-44 w-44 items-center justify-center rounded-full bg-[#ED1C24]/[.06]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/home/brain.jpg" alt="A brain" className="h-36 w-36 rounded-full object-cover" />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <InfoCard card={CARDS[1]} imageSide="left" />
          <InfoCard card={CARDS[3]} imageSide="left" />
        </div>
      </div>
    </section>
  );
}
