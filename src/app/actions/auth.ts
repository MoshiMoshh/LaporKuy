'use server';

import disposableDomains from 'disposable-email-domains';

export async function isDisposableEmail(email: string): Promise<boolean> {
  try {
    const domain = email.split('@')[1];
    if (!domain) return false;
    
    // Check against the 3000+ disposable domains list
    return disposableDomains.includes(domain.toLowerCase());
  } catch (error) {
    console.error('Error checking disposable email:', error);
    return false; // Fail open to not block legitimate users if something goes wrong
  }
}
