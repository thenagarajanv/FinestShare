import React from 'react'
import Home from './Home/page';

export async function generateMetadata() {
  return {
      title: 'Home :: Splitwise',
      description: 'Splitwise Home Page',
  };
}

const Page = () => {
  return (
    <Home/>
  )
}

export default Page;
