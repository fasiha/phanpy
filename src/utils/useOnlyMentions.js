import { useEffect, useState } from 'preact/hooks';

import { getOnlyMentions, persistOnlyMentions } from './store-utils';

export default function useOnlyMentions() {
  const [onlyMentions, setOnlyMentions] = useState(() => !!getOnlyMentions());
  useEffect(() => {
    persistOnlyMentions(onlyMentions);
  }, [onlyMentions]);
  return [onlyMentions, setOnlyMentions];
}
