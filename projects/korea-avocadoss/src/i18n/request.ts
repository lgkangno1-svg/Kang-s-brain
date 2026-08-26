import {hasLocale} from 'next-intl';
import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

import {routing} from './routing';

type Messages = Record<string, unknown>;

function isMessageObject(value: unknown): value is Messages {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function mergeMessages(...sources: Messages[]): Messages {
  const output: Messages = {};

  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      const current = output[key];
      output[key] = isMessageObject(current) && isMessageObject(value)
        ? mergeMessages(current, value)
        : value;
    }
  }

  return output;
}

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;

  if (!requested || !hasLocale(routing.locales, requested)) {
    notFound();
  }

  const [core, publicCopy, hanbok] = await Promise.all([
    import(`../../messages/${requested}.json`),
    import(`../../messages/public/${requested}.json`),
    import(`../../messages/hanbok/${requested}.json`),
  ]);

  return {
    locale: requested,
    messages: mergeMessages(core.default, publicCopy.default, hanbok.default),
  };
});
