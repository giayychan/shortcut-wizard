import useAuthStore from '../stores/useAuthStore';

function useUser() {
  const [user, setUser] = useAuthStore((state) => [state.user, state.setUser]);

  return user;
}

export default useUser;
