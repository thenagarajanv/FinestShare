async function generateMetadata() {
  const title = 'Login in :: Splitwise';
  const describe = 'Splitwise login page';

  return {
    title,describe
  };
}

import Login from '@/app/_components/auth/Login/Login.jsx';

const LogIn = () => {
  return <div>
    <div className="md-3">
      <Login/>
    </div>
  </div>;
};

export default LogIn;
