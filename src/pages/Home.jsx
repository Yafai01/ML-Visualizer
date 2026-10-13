import { Link } from "react-router-dom";
import { MODULES } from "../modules";
import PageHeader from "../components/ui/PageHeader";

export default function Home() {
  return (
    <div className="page">
      <PageHeader eyebrow="Interactive machine learning" title="See classic ML algorithms learn">
        Every model on this site is trained live in your browser on small 2-D datasets you can edit:
        add, drag and erase points, generate new data, and watch the decision boundaries, losses and
        metrics update as they are actually computed.
      </PageHeader>

      <div className="module-grid">
        {MODULES.map((m) => (
          <Link key={m.path} to={m.path} className="module-card">
            <span className="icon-chip" aria-hidden="true">
              <m.Icon size={20} />
            </span>
            <h2>{m.title}</h2>
            <p>{m.summary}</p>
            <span className="method">{m.method}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
