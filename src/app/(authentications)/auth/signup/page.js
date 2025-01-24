export async function generateMetadata() {
  const title = 'Sign Up :: Splitwise';
  const describe = 'Splitwise Sign Up page';

  return {
    title,describe
  };
}
import SignUp from '@/app/_components/auth/SignUp/Signup.jsx'
import { Suspense } from 'react';

const SigUp = () => {
  return <div>
    <div className="md-3">
      <Suspense  fallback={<div>Loading...</div>}>
        <SignUp/>
      </Suspense>
    </div>
  </div>;
};

export default SigUp;
