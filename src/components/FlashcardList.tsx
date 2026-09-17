import { getActiveFlashcards } from '../utils/getActiveFlashcards';
import type { ModuleList, ActiveModuleSummary } from '../types/vocab';

type FlashcardListProps = {
  modules: ModuleList[];
  activeSummaries: ActiveModuleSummary[];
};

export function FlashcardList({ modules, activeSummaries }: FlashcardListProps) {
  const activeFlashcards = getActiveFlashcards(modules, activeSummaries);

  if (activeFlashcards.length === 0) {
    return <p>No lessons selected.</p>;
  }

  return (
    <ul>
      {activeFlashcards.map(card => (
        <li key={card.id}>{card.de}</li>
      ))}
    </ul>
  );
}