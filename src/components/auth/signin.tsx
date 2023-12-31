import { Icons } from '@/components/icons';
import LoginButton from '@/components/login-button';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';

const SignIn = async () => {
  const user = await getCurrentUser();

  if (user) {
    return redirect('/');
  }
  return (
    <div className="container flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm max-w-xs mx-auto">
          By continuing, you are setting up an account and agree to our User
          Agreement and Privacy Policy.
        </p>
      </div>
      <LoginButton />
    </div>
  );
};

export default SignIn;
