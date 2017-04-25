//! moment.js locale configuration
//! locale : English (but short)

import moment from 'moment';

export default moment.defineLocale('short', {
  parentLocale: 'en',
  relativeTime : {
          future: "in %s",
          past:   "%s ago",
          s:  "%ds",
          m:  "1m",
          mm: "%dm",
          h:  "1h",
          hh: "%dh",
          d:  "1d",
          dd: "%dd",
          M:  "1m",
          MM: "%dm",
          y:  "1y",
          yy: "%dy"
      }
});