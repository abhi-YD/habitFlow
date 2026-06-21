import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function AuthCallback() {
  const navigate          = useNavigate();
  const [params]          = useSearchParams();
  const { loginWithToken } = useAuthStore();

  useEffect(() => {
    const token = params.get('token');
    const name  = params.get('name');
    const email = params.get('email');
    const error = params.get('error');

    if (error || !token) {
      navigate('/login?error=google_failed');
      return;
    }

    // store token + user in Zustand + localStorage
    loginWithToken(token, { name, email });
    navigate('/app/dashboard');
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex
                    items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-violet-600
                        border-t-transparent rounded-full
                        animate-spin" />
        <p className="text-[#64748B] text-sm">
          Signing you in with Google...
        </p>
      </div>
    </div>
  );
}