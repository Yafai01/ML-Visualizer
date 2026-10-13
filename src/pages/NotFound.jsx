import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";

export default function NotFound() {
  return (
    <div className="page">
      <PageHeader eyebrow="404" title="Page not found">
        That address does not match any visualizer.
      </PageHeader>
      <Link to="/" className="btn btn-primary">
        Back to overview
      </Link>
    </div>
  );
}
