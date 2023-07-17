import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';
import React from 'react';
import { Icons } from '../icons';

const SSOCallback = () => {
  return (
    // Handle the redirect flow by rendering the
    // prebuilt AuthenticateWithRedirectCallback component.
    // This is the final step in the custom OAuth flow
    <>
      <Icons.spinner className="h-16 w-16 animate-spin" aria-hidden="true" />
      <AuthenticateWithRedirectCallback />
    </>
  );
};

export default SSOCallback;
