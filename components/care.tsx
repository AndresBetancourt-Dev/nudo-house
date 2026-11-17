const areas = [
  ["What your brand stands for", "Its position, its name and the way it speaks."],
  ["How it is recognised", "A visual identity people know before they read the name."],
  ["The images that carry it", "Campaigns, photography and film, directed with intent."],
  ["Its digital home", "A website or online boutique with the finish of a flagship."],
  ["Its everyday presence", "Social media and launches that stay true to the idea."],
  ["A creative eye on call", "Ongoing direction as the brand grows."],
];

export function Care() {
  return (
    <section className="band care">
      <div className="wrap">
        <div className="care-grid">
          <div>
            <div className="mark mono">What we look after</div>
            <h2>Everything your brand needs to be seen as it should.</h2>
          </div>
          <ul className="care-list">
            {areas.map(([title, text]) => (
              <li key={title}>
                <h3 className="t">{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
