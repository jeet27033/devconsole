import React from 'react';
import { Translations } from '@capillarytech/vulcan-react-sdk/components';
import { CapSelect } from '@capillarytech/cap-ui-library';
const { useTranslations } = Translations;
import appConfig from '../../../../app-config';

const localeList = appConfig['i18n'].locales || [];
const englishEquivalent = new Intl.DisplayNames(['en'], { type: 'language' });

const LanguageSwitcher = () => {
  const { locale, changeLocale } = useTranslations();

  const languages = React.useMemo(() => {
    return localeList?.map(curLocale => {
      const tempLang = curLocale.split('-')?.[0];
      const IntlObj = new Intl.DisplayNames([tempLang], { type: 'language' });
      const langEquivalent = IntlObj.of(tempLang);
      const label = `${langEquivalent} (${englishEquivalent.of(tempLang)})`;
      return {
        value: curLocale,
        label,
      };
    });
  }, []);

  return (
    <div>
      <p>Current Language: {locale}</p>
      {languages?.length ? (
        <CapSelect
          options={languages}
          style={{ width: 200 }}
          value={locale}
          onChange={data => {
            changeLocale(data);
          }}
          defaultValue="en-US"
        />
      ) : null}
    </div>
  );
};

export default LanguageSwitcher;
