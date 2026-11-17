const promises = [
  ["A founder, always", "The person you meet is the person who leads your brand."],
  ["Your time zone", "We work around your calendar, wherever you are."],
  ["Absolute discretion", "Your work is shown only when you say so."],
  ["Beyond launch", "We stay close for every new chapter."],
];

export function Concierge() {
  return (
    <section className="band concierge">
      <div className="wrap">
        <div className="mark mono">The concierge</div>
        <h2>One person who knows your brand by heart.</h2>
        <ul className="promises">
          {promises.map(([title, text]) => (
            <li key={title}>
              <h3 className="ser">{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
