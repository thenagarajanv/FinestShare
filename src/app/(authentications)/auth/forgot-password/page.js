
export async function generateMetadata() {
  const title = 'Forget Password :: Splitwise';
  const describe = 'Splitwise Forget Password';

  return {
    title,describe
  };
}
import Forgotpassword from '@/app/_components/auth/Forget-Password/ForgetPassword.jsx';


const ForgetPassword = () => {
  return <div>
    <div className="md-3">
      <Forgotpassword/>
    </div>
  </div>;
};

export default ForgetPassword;
