import { BetaAnalyticsDataClient } from '@google-analytics/data';

const formatPrivateKey = (key: string | undefined) => {
  if (!key) return undefined;
  
  // 1. Remove any surrounding quotes if they exist
  let formattedKey = key.replace(/^["']|["']$/g, '');
  
  // 2. Handle both escaped newlines (\n) and actual newlines
  formattedKey = formattedKey.replace(/\\n/g, '\n');
  
  // 3. Ensure it has the correct headers and is a valid PEM string
  if (!formattedKey.includes('-----BEGIN PRIVATE KEY-----')) {
    console.error('GA_PRIVATE_KEY is missing the "BEGIN PRIVATE KEY" header');
  }
  
  return formattedKey;
};

export const gaClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: formatPrivateKey(process.env.GA_PRIVATE_KEY),
  },
});
