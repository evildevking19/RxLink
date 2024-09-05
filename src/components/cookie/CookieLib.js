import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
// Base styles
import './style.scss';
// Cookie Banner
import './cookie-banner.scss';
// Cookie Dialog
import './cookie-dialog.scss';
// Cookie Options
import './cookie-options.scss';

export const CookieBanner = (props) => {

  const { setDialogState, isBannerOpen, setBannerState } = useContext(CookieContext);

  useEffect(() => {
    Cookies.get('required-cookies') ? setBannerState(false) : setBannerState(true)
  });

  const acceptCookies = () => {
    Cookies.set('required-cookies', 'true');
    setBannerState(false);
  }

  const manageConsent = () => {
    setDialogState(true);
  }

  return (
    <>
      <div id="cookie-bar" className={`cookie-consent-banner ${isBannerOpen ? 'is-active' : ''} ${props.cssClass}`}>
        {/* <i className='fa fa-close' onClick={() => setBannerState(false)}></i> */}
        <div className="policy-info">
          <h2 className="title">{props.title}</h2>
          <p className="description">
            {props.message} {props.policyText} <a href={props.policyLink}>{props.policyLinkText}</a>
          </p>
        </div>
        <div className="cta-actions">
          <button className='cookie-btn' onClick={acceptCookies}>{props.acceptButtonText}</button>
          <button className='cookie-btn' onClick={manageConsent}>{props.manageConsentText}</button>
        </div>
      </div>
      {props.children}
    </>
  );
}

CookieBanner.defaultProps = {
  title: 'Your privacy',
  message: 'This site uses cookies to offer you a better browsing experience. By accepting, you consent to the use of cookies.',
  policyText: 'To find out more, read our updated policy terms in the link',
  policyLinkText: 'Cookie Policy',
  policyLink: 'https://gdpr.eu/cookies/',
  acceptButtonText: 'Accept',
  manageConsentText: 'Customize',
  cssClass: ''
}


export const CookieDialog = (props) => {

  const { isDialogOpen, setDialogState } = useContext(CookieContext);

  useEffect(() => {
  }, [])

  // Events
  //--------

  const closeDialog = (e) => {
    e.preventDefault();
    setDialogState(false);
  }

  // Functions
  //----------

  return (

    <>
      <div className={`cookie-preference-dialog ${isDialogOpen ? 'is-visible' : ''} ${props.cssClass}`}>
        <div className="container">
          <h1>{props.title}</h1>
          <p>{props.message}</p>

          {props.children}

          <div className="button-actions">
            <button className='cookie-btn' onClick={closeDialog}>{props.confirmText}</button>
            <button className='cookie-btn' onClick={closeDialog}>{props.cancelText}</button>
          </div>

        </div>
      </div>
      <div className={`body-overlay ${isDialogOpen ? 'is-visible' : ''}`}></div>

    </>
  );

}

CookieDialog.defaultProps = {
  title: 'Who can use your cookies?',
  message: 'Please review and manage your privacy settings below',
  cssClass: 'css',
  confirmText: 'Save Options',
  cancelText: 'Cancel'
}

export const RequiredCheckbox = (props) => {

  return (
    <div className="cookie-options-wrapper">

      <h3 className="title">{props.title}</h3>

      <div className='cookie-option'>
        <label className="checkbox-container readonly">{""}
            <input type="checkbox" checked={true} readOnly/>
            <span className="checkmark"></span>
        </label>
        <div className="description">
          <p>{props.message}</p>
        </div>
      </div>
    </div>
  )

}

export const MarketingCheckbox = (props) => {

  const [marketingCookie, setMarketingCookie] = useState(false);

  useEffect(() => {
    Cookies.get(props.name) ? setMarketingCookie(true) : setMarketingCookie(false);
  }, []);

  const toggleMarketing = (e) => {

    setMarketingCookie(e.target.checked);

    if (e.target.checked) {
      Cookies.set(props.name, e.target.checked);
    } else {
      Cookies.remove(props.name);
    }

    // callback with checkbox status if necessary
    props.onMarketingToggle(e.target.checked);

  }

  return (
    <div className="cookie-options-wrapper">

      <h3 className="title">{props.title}</h3>

      <div className='cookie-option'>
        <label className="checkbox-container">{""}
          <input type="checkbox" checked={marketingCookie} onChange={toggleMarketing}/>
          <span className="checkmark"></span>
        </label>
        <div className="description">
          <p>{props.message}</p>
        </div>
      </div>
    </div>
  )

}


export const PerformanceCheckbox = (props) => {

  const [performanceCookie, setPerformanceCookie] = useState(false);
  
  useEffect(() => {
    Cookies.get(props.name) ? setPerformanceCookie(true) : setPerformanceCookie(false);
  }, []);

  const togglePerformance = (e) => {

    setPerformanceCookie(e.target.checked);

    if (e.target.checked) {
      Cookies.set(props.name, e.target.checked);
    } else {
      Cookies.remove(props.name);
    }
    // callback with checkbox status if necessary
    props.onPerformanceToggle(e.target.checked);

  }


  return (
    <div className="cookie-options-wrapper">

      <h3 className="title">{props.title}</h3>

      <div className='cookie-option'>
        <label className="checkbox-container">{""}
          <input type="checkbox" checked={performanceCookie} onChange={togglePerformance}/>
          <span className="checkmark"></span>
        </label>
        <div className="description">
          <p>{props.message}</p>
        </div>
      </div>
    </div>
  )

}

RequiredCheckbox.defaultProps = {
  title: 'Required',
  message: 'Necessary cookies are essential for the website to function, without them the website would not function properly. (eg access to secure areas of the site, security, legislation)',
  name: 'required_cookie',
  onRequiredToggle: function () { }
}

MarketingCheckbox.defaultProps = {
  title: 'Marketing',
  message: 'Marketing or advertising cookies track the browsing of visitors and collect data so that the company can provide more relevant advertisements according to such behavior.',
  name: 'marketing_cookie',
  onMarketingToggle: function () { }
}

PerformanceCheckbox.defaultProps = {
  title: 'Performance',
  message: 'Performance cookies allow the website to behave according to the visitor, adjusting to their location, preferred language, etc.',
  name: 'performance_cookie',
  onPerformanceToggle: function () { }
}


/*******************
 * Context API
 ******************/

export const CookieContext = createContext();

export const CookieContextProvider = (props) => {

  const [isDialogOpen, setDialogState] = useState(false);
  const [isBannerOpen, setBannerState] = useState(false);

  return (
    <CookieContext.Provider value={{ isDialogOpen, setDialogState, isBannerOpen, setBannerState }}>
      {props.children}
    </CookieContext.Provider>
  )
}