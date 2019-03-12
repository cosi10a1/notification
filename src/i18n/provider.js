import englishMessages from './en';
import frenchMessages from './fr'

export default (locale) => {
  if (locale === 'fr') {
    return frenchMessages;
  }

  // Always fallback on english
  return englishMessages;
};
