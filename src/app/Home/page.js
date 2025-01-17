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
            <div className="md-3">
                <HomePage />
            </div>
        </div>
    );
};

export default Home;
