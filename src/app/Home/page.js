import HomePage from "../_components/home/HomePage";

export async function generateMetadata() {
  return {
      title: 'Home :: Splitwise',
      description: 'Splitwise Home Page',
  };
}

const Home = () => {
    return (
        <div>
            <div className="" suppressHydrationWarning>
                <HomePage />
            </div>
        </div>
    );
};

export default Home;
