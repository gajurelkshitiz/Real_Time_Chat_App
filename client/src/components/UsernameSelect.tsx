import React, { useState } from "react";

export default function UsernameSelect({ onSelect }: { onSelect: (username: string) => void }) {
  const [name, setName] = useState("");
  return (
    <div>
      <h2>Select username</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Your username" />
      <button onClick={() => onSelect(name)} disabled={!name.trim()}>Join</button>
    </div>
  );
}
