import {hasLocale} from 'next-intl';
import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;

  if (!requested || !hasLocale(routing.locales, requested)) {
    notFound();
  }

  const [core, publicCopy] = await Promise.all([
    import(`../../messages/${requested}.json`),
    import(`../../messages/public/${requested}.json`),
  ]);

  return {
    locale: requested,
    messages: {
      ...core.default,
      ...publicCopy.default,
    },
  };
});
