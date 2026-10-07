'use client';
import { useState, type ReactNode } from 'react';

/** Vertical tabs (the source's “Addiction” tabs). Panels are server-rendered children; all panel text is in the page HTML. */
export default function TabsBlock({ titles, panels }: { titles: string[]; panels: ReactNode[] }) {
  const [on, setOn] = useState(0);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px,280px) minmax(0,1fr)', gap: '32px', alignItems: 'start' }} data-cols="200px minmax(0,1fr)" data-rc-gap="1">
      <div role="tablist" aria-orientation="vertical" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {titles.map((t, i) => (
          <button key={t + i} role="tab" type="button" aria-selected={on === i} onClick={() => setOn(i)} style={{ textAlign: 'left', cursor: 'pointer', font: '600 16px Jost,sans-serif', padding: '14px 18px', borderRadius: '14px', border: '1px solid ' + (on === i ? '#0890E8' : '#dbe6f0'), background: on === i ? '#0890E8' : '#fff', color: on === i ? '#fff' : '#10233a' }}>{t}</button>
        ))}
      </div>
      <div>
        {panels.map((p, i) => (<div key={i} role="tabpanel" hidden={on !== i}>{p}</div>))}
      </div>
    </div>
  );
}
