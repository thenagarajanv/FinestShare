"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, Suspense } from 'react';

const RedirectPage = () => {
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

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RedirectPage />
    </Suspense>
  );
}
