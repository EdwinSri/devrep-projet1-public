import { useRouter } from 'next/router';

import Layout from '@/components/Layout';

export default function Home() {
  const router = useRouter();
  if (typeof window !== 'undefined') {
    router.push('/search')
  }

  return <Layout />
}
