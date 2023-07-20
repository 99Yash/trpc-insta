import { UserProfile } from '@clerk/nextjs';
import React from 'react';

const page = () => {
  return (
    <div className="max-h-screen flex justify-center items-center ">
      <UserProfile
        appearance={{
          variables: {
            colorPrimary: '#161616',
            colorText: '#e9e0e0',
          },
          elements: {
            // Main card element
            card: 'shadow-none bg-background text-foreground',
            navbar: 'hidden',
            navbarMobileMenuButton: 'hidden',
            pageScrollBox: 'bg-gray-800 border border-black',
            profileSectionPrimaryButton: 'text-gray-300',
            badge: 'text-gray-950 bg-gray-500',
            // headerTitle: 'hidden',
            // headerSubtitle: 'hidden',
          },
        }}
      />
    </div>
  );
};

export default page;
