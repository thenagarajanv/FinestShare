import Resetpassword from '@/app/_components/auth/Reset-Password/ResetPassword.jsx';
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
      <Resetpassword/>
    </div>
  </div>;
};

export default ResetPassword;
