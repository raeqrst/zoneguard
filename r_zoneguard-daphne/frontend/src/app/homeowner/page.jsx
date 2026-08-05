import { redirect } from 'next/navigation';

export default function HomeownerRootRedirect() {
  redirect('/login');
}