import { useRouter } from 'next/router';

const GoBackButton = () => {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <button onClick={goBack} className="btn btn-circle btn-primary absolute top-4 left-4 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 mr-1">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
};

export default GoBackButton;
