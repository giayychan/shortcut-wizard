import { Anchor } from '@mantine/core';
import { v4 } from 'uuid';

function SignInButton() {
  const uuid = v4();

  return (
    <Anchor
      href={`http://localhost:3000/auth/sign-in-helper/${uuid}`}
      target="_blank"
      size="xs"
      align="right"
      mt={5}
      mr={5}
    >
      Sign in
    </Anchor>
  );
}
export default SignInButton;
