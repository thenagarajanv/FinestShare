async function generateMetadata() {
  const title = 'Login in :: Splitwise';
  const describe = 'Splitwise login page';

  return {
    title,describe
  };
}

import Login from '@/app/_components/auth/Login/Login.jsx';
import { Suspense } from 'react';

const LogIn = () => {
  return <div>
    <div className="md-3">
      <Suspense  fallback={<div>Loading...</div>}>
        <Login/>
      </Suspense>
    </div>
  </div>;
};

export default LogIn;
