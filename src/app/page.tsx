

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Student Portal</h1>
      <p className="mb-6 text-lg text-center max-w-xl">
        Log in to view your available quizzes, take practice tests, and check your results.
      </p>
      <a
        href="/login"
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Go to Login
      </a>
    </main>
  );
}

