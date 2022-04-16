import Color from '../Theme/Color';

export const constants = {
  app: 'APP',
};

/*
 @pending: documents not submitted yet
 @progress: documents submitted but waiting for confirmation from 3p aadhaar service
 @complete: documents submitted and verified by the 3P aadhaar service
 */
export const KYC_STATUS = {
  PENDING: 'pending',
  PROGRESS: 'requested',
  COMPLETE: 'complete',
};

export const DIGIO_CONSTANTS = {
  development: {
    BASE_URL: 'https://ext.digio.in:444',
    CLIENT_ID: 'AIHAIC6JR1LTXWISQ9WLYWF4M1XGOLDQ',
    CLIENT_SECRET: 'T4HB8PRP8GIN5KO775XZZS49BQ36X6AI',
    WEBVIEW_URL: 'https://ext.digio.in',
  },
  production: {
    BASE_URL: 'https://api.digio.in',
    CLIENT_ID: 'AIQ8C4ZFVU74YU7PH57V8KROXZXJG72T',
    CLIENT_SECRET: 'R5DZBGNXTX',
    WEBVIEW_URL: 'https://app.digio.in',
  },
};

export const OrderStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
};

export const ORDER_STATUS = {
  PENDING: {text: 'Pending', color: Color.LightGrey1},
  ACCEPTED: {text: 'Accepted', color: Color.GREEN},
  REJECTED: {text: 'Rejected', color: Color.RED},
};
