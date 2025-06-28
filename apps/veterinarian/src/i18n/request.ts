import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
//import { enMessages, frMessages } from '@app-test2/shared-components';

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  //read from cookies
  const lang_cookies = await cookies();
  const locale = lang_cookies.get('locale')?.value || 'fr';

  return {
    locale,
    messages: {
      ...(await import(`../../messages/${locale}.json`)).default,
      //   ...(locale === 'fr' ? frMessages : enMessages),
    },
  };
});
