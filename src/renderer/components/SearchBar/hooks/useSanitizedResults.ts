import { useState, useEffect } from 'react';
import { FuseSearchState } from '../../../stores/useFuseSearchStore';
import { FlattenShortcut } from '../../../../../@types/shortcuts';

export default function useSanitizedResults(
  results: FuseSearchState['results']
) {
  const [sanitizedResults, setSanitizedResults] = useState<FlattenShortcut[]>(
    []
  );

  useEffect(() => {
    if (results.length === 0) return;

    const sanitized = results.map(({ item }) => item);
    setSanitizedResults(sanitized);
  }, [results]);

  return sanitizedResults;
}
