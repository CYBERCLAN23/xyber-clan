import { translations } from '../translations';
import { useLanguage } from '../context/LanguageContext';
import { useCMS } from '../context/CMSContext';
import EditableText from '../components/cms/EditableText';
import EditableImage from '../components/cms/EditableImage';
import EditableLink from '../components/cms/EditableLink';

/** Read a dot path ("hero.cta.primary", "list.0.title") from an object. */
export const getPath = (obj, path) =>
  path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);

/**
 * Translations for the active language.
 *   const { t, lang, tr } = useT();
 *   tr('hero.subtitle')  -> CMS override → translations → fallback (plain string)
 */
export function useT() {
  const { language, setLanguage, toggleLanguage } = useLanguage();
  const { getContent, isEditing } = useCMS();
  const t = translations[language] || translations.en;
  const tr = (k, fallback) => {
    const base = getPath(t, k);
    const value = getContent(`${language}.${k}`, base ?? fallback ?? '');
    return value === '' || value == null ? base ?? fallback ?? '' : value;
  };
  return { t, lang: language, setLanguage, toggleLanguage, tr, isEditing };
}

/**
 * Editable text bound to a CMS key.
 *   <T k="hero.subtitle" as="p" />          key = `${lang}.hero.subtitle`, fallback from translations
 *   <T ck="en.team.josias.name" fb="…" />    complete key (when the original site used a fixed key)
 * In edit mode the admin can click and change it in place.
 */
export function T({ k, ck, fb, as = 'span', className, multiline, ...rest }) {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const key = ck || `${language}.${k}`;
  const fallback = fb ?? (k ? getPath(t, k) : undefined) ?? '';
  return (
    <EditableText contentKey={key} fallback={fallback == null ? '' : String(fallback)} tag={as} className={className} multiline={multiline} {...rest} />
  );
}

/**
 * Editable image. Falls back across languages so an image changed only in one
 * language still shows in the other (the old site stored team photos under en.*).
 */
export function Img({ k, ck, src, alt = '', className, ...rest }) {
  const { language } = useLanguage();
  const { getContent } = useCMS();
  const key = ck || `${language}.${k}`;
  let fallback = src;
  if (!ck && k) {
    const other = language === 'en' ? 'fr' : 'en';
    fallback = getContent(`${other}.${k}`, src);
  }
  return <EditableImage contentKey={key} src={fallback} alt={alt} className={className} loading="lazy" decoding="async" {...rest} />;
}

/** Editable link (label + url). */
export function L({ k, ck, href, children, className, ...rest }) {
  const { language } = useLanguage();
  const key = ck || `${language}.${k}`;
  return (
    <EditableLink contentKey={key} href={href} className={className} {...rest}>
      {children}
    </EditableLink>
  );
}
