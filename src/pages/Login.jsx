import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
  };
  const handelLogin = () => {
    navigate('/');
  }

  return (
    <section
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)", // cool dark gradient
      }}
    >
      <div className="flex w-full max-w-5xl shadow-lg rounded-lg overflow-hidden bg-neutral-800">
        <div className="w-full lg:w-1/2 p-10 text-white">
          <div className="text-center mb-10">
            <img className="mx-auto w-24 mb-4" src="/logo.png" alt="logo" />
            <h2 className="text-2xl font-bold">One Stop Tracker</h2>
          </div>

          <form>
            <p className="mb-6 text-sm text-gray-300">Please login to your account</p>

            <div className="mb-4">
              <label className="block text-sm mb-1">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full rounded-md px-4 py-2 bg-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-md px-4 py-2 bg-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 py-2 text-white font-semibold uppercase shadow-md hover:shadow-lg transition"
              onClick={handelLogin}
            >
              Log in
            </button>

            <div className="text-sm text-center mt-4">
              <a href="#" className="text-white underline">Forgot password?</a>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm">Don't have an account?</p>
              <button
                type="button"
                className="rounded border border-white px-4 py-1 text-xs uppercase text-white hover:bg-white hover:text-neutral-800 transition"
                onClick={handleRegisterClick}
              >
                Register
              </button>
            </div>
          </form>
        </div>

        <div
          className="hidden lg:flex lg:w-1/2 items-center justify-center text-white text-center p-10"
          style={{
            background: "linear-gradient(to right, #ff512f, #dd2476)",
          }}
        >
          <div>
            <h3 className="text-2xl font-bold mb-4">One Stop Tracker</h3>
            <p className="text-sm">
              Welcome to your unified tracking dashboard. Stay on top of your tasks, habits, and analytics—all in one place.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
