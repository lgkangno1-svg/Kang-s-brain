import {permanentRedirect} from 'next/navigation';

export default function LegacyRootFallback() {
  permanentRedirect('/en');
}
