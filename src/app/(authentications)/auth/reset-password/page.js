import Resetpassword from '@/app/_components/auth/Reset-Password/ResetPassword.jsx';
import { Suspense } from 'react';

export async function generateMetadata() {
  const title = 'Reset Password :: Splitwise';
  const describe = 'Splitwise Reset Password';

  return {
    title,describe
  };
}


const ResetPassword = () => {
  return <div>
    <div className="md-3">
    <Suspense fallback={<div>Loading...</div>}>
      <Resetpassword/>
    </Suspense>
    </div>
  </div>;
};

export default ResetPassword;
