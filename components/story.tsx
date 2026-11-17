import type { ReactNode } from "react";

const movements: { num: string; title: string; body: ReactNode; receive: string }[] = [
  {
    num: "i.",
    title: "We listen.",
    body: "A conversation, not a brief. We want to understand where you come from, what you protect and where you intend to go.",
    receive: "A first point of view, in the room.",
  },
  {
    num: "ii.",
    title: "We strip back.",
    body: (
      <>
        We remove what is borrowed until what is true about your brand is plain
        to see. This is the <span className="ser">nudo</span>: the brand, naked.
      </>
    ),
    receive: "One idea your whole team can say.",
  },
  {
    num: "iii.",
    title: "We bind.",
    body: "That idea becomes everything people see: the mark, the images, the website, the way you appear every day. Tied together like a knot, so it does not come undone.",
    receive: "A complete brand, finished by hand.",
  },
  {
    num: "iv.",
    title: "We stay.",
    body: "A brand is never finished on launch day. We remain beside you for campaigns, new chapters and the evolution of your digital presence, for as long as you need us.",
    receive: "A creative director on call.",
  },
];

export function Story() {
  return (
    <section className="band story">
      <div className="wrap">
        <div className="mark mono">How a commission unfolds</div>
        <div className="story-intro">
          <h2>Tailored, from the first conversation.</h2>
          <p>
            There is no package and no template. Each brand we take on is guided
            by one founder, at the pace the brand needs, in four movements.
          </p>
        </div>
        <ol className="chapters">
          {movements.map((movement) => (
            <li className="chapter" key={movement.num}>
              <span className="num">{movement.num}</span>
              <div>
                <h3>{movement.title}</h3>
                <p>{movement.body}</p>
              </div>
              <div className="aside">
                <span className="mono">You receive</span>
                <span className="ser">{movement.receive}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
