import PageHeader from "../components/ui/PageHeader";
import { ExternalIcon } from "../components/Icons";

export default function About() {
  return (
    <div className="page">
      <PageHeader eyebrow="Project" title="About">
        Yafai ML Lab is a learning tool for building intuition about how classic machine learning
        algorithms behave. All computation runs client-side in plain JavaScript; there is no server
        and nothing you enter leaves your browser.
      </PageHeader>

      <div className="stack" style={{ maxWidth: 760 }}>
        <section className="card" aria-labelledby="about-author">
          <h2 id="about-author">Author</h2>
          <dl className="about-list">
            <dt>Name</dt>
            <dd>Yafai</dd>
            <dt>Role</dt>
            <dd>AI/ML Engineering Student at VREC</dd>
            <dt>GitHub</dt>
            <dd>
              <a href="https://github.com/Yafai01" target="_blank" rel="noopener noreferrer">
                @Yafai01 <ExternalIcon size={14} />
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </dd>
            <dt>Email</dt>
            <dd>
              <a href="mailto:waledyafai31@gmail.com">waledyafai31@gmail.com</a>
            </dd>
          </dl>
        </section>

        <section className="card" aria-labelledby="about-scope">
          <h2 id="about-scope">Scope and limitations</h2>
          <div className="explainer" style={{ marginTop: 0 }}>
            <p>
              The implementations favour clarity over speed and are meant for small, two-dimensional
              toy datasets (tens to a few hundred points). They are not a substitute for libraries such
              as scikit-learn on real data.
            </p>
            <p>
              Source code:{" "}
              <a href="https://github.com/Yafai01/ML-Visualizer" target="_blank" rel="noopener noreferrer">
                github.com/Yafai01/ML-Visualizer
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
