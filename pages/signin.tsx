import { useRouter } from 'next/router';
import { useState, FormEvent } from 'react';

import Button from 'components/ui/Button';
import GitHub from 'components/icons/GitHub';
import Input from 'components/ui/Input';
import Logo from 'components/icons/Logo';
import { getURL } from '@/utils/helpers';
import { useSignInEmailPasswordless } from '@nhost/nextjs';
import { nhost } from '@/utils/nhost';

const SignIn = () => {
  const [email, setEmail] = useState('');

  const { signInEmailPasswordless, isLoading, isError, error, isSuccess } =
    useSignInEmailPasswordless();

  const handleSignin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await signInEmailPasswordless(email, {
      redirectTo: getURL()
    });
  };

  return (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
        <div className="flex justify-center pb-12 ">
          <Logo width="64px" height="64px" />
        </div>
        {isError && (
          <div className={`text-pink-500 border border-pink-500 p-3`}>
            {error?.message}
          </div>
        )}
        {isSuccess && (
          <div className={`text-green-500 border border-green-500 p-3`}>
            Check your email for the Magic Link
          </div>
        )}
        <div className="flex flex-col space-y-4">
          <form onSubmit={handleSignin} className="flex flex-col space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={setEmail}
              required
            />
            <Button
              variant="slim"
              type="submit"
              loading={isLoading}
              disabled={!email.length}
            >
              Send magic link
            </Button>
          </form>
        </div>

        <div className="flex items-center my-6">
          <div
            className="border-t border-zinc-600 flex-grow mr-3"
            aria-hidden="true"
          ></div>
          <div className="text-zinc-400">Or</div>
          <div
            className="border-t border-zinc-600 flex-grow ml-3"
            aria-hidden="true"
          ></div>
        </div>

        <Button
          variant="slim"
          type="submit"
          disabled={isLoading}
          onClick={() => nhost.auth.signIn({ provider: 'github' })}
        >
          <GitHub />
          <span className="ml-2">Continue with GitHub</span>
        </Button>
      </div>
    </div>
  );
};

export default SignIn;
