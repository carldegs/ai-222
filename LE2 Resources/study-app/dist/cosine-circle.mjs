// Label the upper half-turn used by the cosine decay schedule.
const angles = [
  [0, '0', '1'],
  [30, 'π/6', '√3/2'],
  [45, 'π/4', '√2/2'],
  [60, 'π/3', '1/2'],
  [90, 'π/2', '0'],
  [120, '2π/3', '−1/2'],
  [135, '3π/4', '−√2/2'],
  [150, '5π/6', '−√3/2'],
  [180, 'π', '−1']
];

export function cosineCircle() {
  const cx = 260, cy = 215, radius = 126;
  const marks = angles.map(([degrees, angle, cosine]) => {
    const radians = degrees * Math.PI / 180;
    const pointX = cx + radius * Math.cos(radians);
    const pointY = cy - radius * Math.sin(radians);
    const labelX = cx + 190 * Math.cos(radians);
    const labelY = cy - 167 * Math.sin(radians);
    const highlight = degrees === 60 ? ' class="cosine-highlight"' : '';
    return `<g${highlight}>
      <line class="cosine-spoke" x1="${cx}" y1="${cy}" x2="${pointX}" y2="${pointY}"/>
      <circle cx="${pointX}" cy="${pointY}" r="3"/>
      <text x="${labelX}" y="${labelY - 8}" class="cosine-angle">${angle}</text>
      <text x="${labelX}" y="${labelY + 11}" class="cosine-value">${cosine}</text>
    </g>`;
  }).join('');

  return `<figure class="cosine-circle">
    <svg viewBox="0 0 520 355" role="img" aria-label="Unit circle for cosine decay. ${angles.map(([, angle, cosine]) => `Cosine of ${angle} equals ${cosine}.`).join(' ')}">
      <circle class="cosine-outline" cx="${cx}" cy="${cy}" r="${radius}"/>
      <path class="cosine-arc" d="M 134 215 A 126 126 0 0 1 386 215"/>
      <path class="cosine-axis" d="M 116 215 H 404 M 260 207 V 223"/>
      ${marks}
      <path class="cosine-projection" d="M 323 106 V 215"/>
      <circle class="cosine-highlight" cx="323" cy="215" r="3"/>
      <text class="cosine-value cosine-highlight" x="323" y="238">x = 1/2</text>
      <text class="cosine-axis-label" x="260" y="265">Horizontal coordinate = cosine</text>
    </svg>
    <figcaption>Read each ray’s angle in radians above its cosine value. The dashed line shows how the point at π/3 projects onto x = 1/2. Cosine decay follows the upper half of the circle, from 0 to π.</figcaption>
  </figure>`;
}
