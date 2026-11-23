// Values the old Journey page hardcoded in its markup. The milestones themselves
// live in translations.js (journey.events) and stay there, in the same order,
// because their CMS keys are index based: `${lang}.journeyPage.event${idx}.*`.

/** Hero stat: the year the clan started. */
export const INCEPTION_YEAR = '2023';

/** Crop used when a milestone has no objectPosition (old desktop default). */
export const DEFAULT_OBJECT_POSITION = 'center center';

/** Where the closing call to action leads. */
export const CTA_ROUTE = '/start-project';

/** First four-digit year found in a date label ("July 10, 2026" -> "2026"). */
export const yearOf = (date) => (String(date || '').match(/\d{4}/) || [])[0] || '';
