export async function generateMetadata() {
  const title = 'Sign Up :: Splitwise';
  const describe = 'Splitwise Sign Up page';

  return {
    title,describe
  };
}
import SignUp from '@/app/_components/auth/SignUp/Signup.jsx'

const SigUp = () => {
  return <div>
    <div className="md-3">
      <SignUp/>
    </div>
  </div>;
};

export default SigUp;
