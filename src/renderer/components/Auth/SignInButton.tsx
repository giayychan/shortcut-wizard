import { Button } from '@mantine/core';
import { ref } from 'firebase/database';
import { db } from 'main/firebase';
import { v4 } from 'uuid';

const { ipcRenderer } = window.electron;

function SignInButton() {
  const handleSignIn = () => {
    // generating uuid
    const uuid = v4();

    // grabbing reference to the firebase realtime db document for the uuid
    const oneTimeUuidDocRef = ref(db, `onetime-uuids/${uuid}`);

    // applying listener to the reference document
    oneTimeUuidDocRef.on('value', async (snapshot) => {
      // getting the custom firebase token
      const authToken = snapshot.val();

      // use this credential accordingly
      const credential = await firebase.auth().signInWithCustomToken(authToken);

      /*
        Your rest auth code
      */
    });

    // invoking main process method to open user's default browser
    window.ipcRenderer.invoke('initiate-login', uuid);
  };

  return <Button onClick={handleSignIn}>Sign in</Button>;
}
export default SignInButton;
