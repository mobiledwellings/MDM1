import { useParams, useNavigate } from "react-router-dom";
import { useRigs } from "../contexts/RigsContext";
import { RigDetail } from "../components/RigDetail";

export function RigDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { rigs } = useRigs();

  const rig = rigs.find(r => r.id === id);

  if (!rig) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Listing Not Found</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <RigDetail rig={rig} onClose={() => navigate(-1)} />;
}
