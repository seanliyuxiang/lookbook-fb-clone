export const monthFullNames = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Return the distance between the given date and now in words.
 * @param {string} pastDateStr 
 * @returns 
 */
export function formatDistanceToNow(pastDateStr) {
  // `Date.now()` evaluates to the same value as `(new Date()).getTime()`
  const currentDateInMillisecondsSinceEpoch = Date.now();

  const pastDateInMillisecondsSinceEpoch = (new Date(pastDateStr)).getTime();

  const diffInMilliseconds = currentDateInMillisecondsSinceEpoch - pastDateInMillisecondsSinceEpoch;

  if (diffInMilliseconds < 60000) { // 1 minute = 60000 milliseconds
    return 'Less than a minute ago';

  } else if (60000 <= diffInMilliseconds && diffInMilliseconds < 3600000) { // 1 hour = 60 minutes = 3600000 milliseconds
    const minutes = Math.round(diffInMilliseconds / 60000);
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;

  } else if (3600000 <= diffInMilliseconds && diffInMilliseconds < 86400000) { // 1 day = 24 hours = 86400000 milliseconds
    const hours = Math.round(diffInMilliseconds / 3600000);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  } else if (86400000 <= diffInMilliseconds && diffInMilliseconds < 2628002880) { // 1 month = 30.4167 days = 2628002880 milliseconds
    const days = Math.round(diffInMilliseconds / 86400000);
    return `${days} day${days === 1 ? '' : 's'} ago`;

  } else if (2628002880 <= diffInMilliseconds && diffInMilliseconds < 31557584000) { // 1 year = 12.0082 months = 31557584000 milliseconds
    const months = Math.round(diffInMilliseconds / 2628002880);
    return `${months} month${months === 1 ? '' : 's'} ago`;

  } else {
    const years = Math.round(diffInMilliseconds / 31557584000);
    return `${years} year${years === 1 ? '' : 's'} ago`;
  }
}