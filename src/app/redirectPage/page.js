"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token'); 
    if (token) {
      localStorage.setItem('token', token);
      router.push('/dashboard');
    }
  }, [searchParams, router]);

  return (
    <div>
      Loading...
    </div>
  );
}

export default Page;
