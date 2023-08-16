import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Anchor, Button, TextInput } from '@mantine/core';
import GOOGLE from '../../../../assets/google.svg';
import LOGO from '../../../../assets/icon.png';
// import BrandLogo from '../common/BrandLogo';
// import SignInButton from './SignInButton';

function SignInPrompt({ isDisplayed }: { isDisplayed: boolean }) {
  if (!isDisplayed) return null;

  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      // // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // // The email of the user's account used.
      // const { email } = error.customData;
      // // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(error);
    }
  };

  return (
    <div className="w-full h-96 flex flex-col items-center justify-center gap-6">
      <img src={LOGO} alt="logo" width="50px" height="50px" />
      <div className="flex flex-row gap-10">
        <TextInput
          label="Email"
          // value={email}
          // onChange={(e) => {
          //   setEmailError('');
          //   setEmail(e.target.value);
          // }}
          // error={emailError}
          styles={{
            input: { borderColor: '#4b5563', backgroundColor: '#111827' },
          }}
          className="text-slate-300"
        />
        <TextInput
          label="Password"
          // value={password}
          // onChange={(e) => {
          //   setPasswordError('');
          //   setPassword(e.target.value);
          // }}
          // error={passwordError}
          styles={{
            input: { borderColor: '#4b5563', backgroundColor: '#111827' },
          }}
          className="text-slate-300"
        />
      </div>
      <div className="flex flex-col gap-4">
        <Button
          w={400}
          type="submit"
          // disabled={loadingWithEmailAndPassword || loadingWithGoogle}
          // leftSection={
          //   loadingWithEmailAndPassword ? <Loader color="white" /> : null
          // }
        >
          Sign in
        </Button>
        {/* <SignInButton /> */}
        <hr className="border-[0.5px] border-gray-500 w-[400px]" />
        <Button
          // disabled={loadingWithEmailAndPassword || loadingWithGoogle}
          // onClick={signInWithGoogle}
          // leftSection={loadingWithGoogle ? <Loader color="white" /> : null}
          onClick={handleGoogleSignIn}
          w={400}
          variant="white"
          color="gray"
          className="hover:bg-slate-300"
        >
          <div className="flex items-center gap-2">
            <img src={GOOGLE} alt="Google icon" width={30} height={1} />
            <p>Continue with Google</p>
          </div>
        </Button>
      </div>
      <div className="flex flex-row gap-10">
        <Anchor
        // href={`/auth/sign-up${
        //   signInFrom ? `?sign_in_from=${signInFrom}` : ''
        // }`}
        >
          Need an account?
        </Anchor>
        <Anchor href="/auth/forgot-password">Forgotten password?</Anchor>
      </div>
    </div>
  );
}

export default SignInPrompt;
