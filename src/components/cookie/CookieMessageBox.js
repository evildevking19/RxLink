import React from 'react';
import { CookieBanner, CookieDialog } from './CookieLib';
import { CookieContextProvider } from './CookieLib';
import { RequiredCheckbox, MarketingCheckbox } from './CookieLib';

const CookieMessageBox = () => {
  return (
    <CookieContextProvider>
      <CookieBanner>
        <CookieDialog>
          <RequiredCheckbox />
          <MarketingCheckbox />
        </CookieDialog>
      </CookieBanner>
    </CookieContextProvider>
  );
};

export default CookieMessageBox;
