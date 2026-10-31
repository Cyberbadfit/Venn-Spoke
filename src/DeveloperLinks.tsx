import { Camera, Code2 } from "lucide-react";

export default function DeveloperLinks() {
  return (
    <nav className="developer-links" aria-label="Developer contact links">
      <a href="https://github.com/Cyberbadfit" target="_blank" rel="noreferrer" aria-label="Developer GitHub">
        <Code2 aria-hidden="true" />
      </a>
      <a href="https://www.instagram.com/cyber_badfit?igsh=bWpyYWg1dW14cW1x" target="_blank" rel="noreferrer" aria-label="Developer Instagram">
        <Camera aria-hidden="true" />
      </a>
    </nav>
  );
}
