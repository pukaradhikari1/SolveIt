import { useState } from "react";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        username: "",
        phone: ""
    });

    const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
    const [resetContact, setResetContact] = useState("");
    const [resetMethod, setResetMethod] = useState("email");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

     const handleSubmit = (e) => {
        e.preventDefault();
        const endpoint = isLogin ? "/login" : "/signup";
        console.log(`Send POST to ${endpoint} with:`, formData);
        // TODO: Replace with fetch call to Flask backend
    };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      {!forgotPasswordMode ? (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isLogin ? "Login to Your Account" : "Create an Account"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number (optional)"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {isLogin && (
              <div className="text-right mt-1">
                <button
                  type="button"
                  className="text-sm text-blue-500 hover:underline font-semibold"
                  onClick={() => setForgotPasswordMode(true)}
                >
                  Forgot Password?
                </button>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              className="text-blue-500 hover:underline font-semibold"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Reset Password
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert(
                `Request password reset via ${resetMethod}: ${resetContact}`
              );
              // TODO: Add your API call here
            }}
            className="space-y-4"
          >
            <div className="flex justify-center gap-4 mb-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="method"
                  value="email"
                  checked={resetMethod === "email"}
                  onChange={() => setResetMethod("email")}
                  className="mr-2"
                />
                Email
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="method"
                  value="phone"
                  checked={resetMethod === "phone"}
                  onChange={() => setResetMethod("phone")}
                  className="mr-2"
                />
                Phone
              </label>
            </div>
            <input
              type={resetMethod === "email" ? "email" : "tel"}
              placeholder={
                resetMethod === "email"
                  ? "Enter your registered email"
                  : "Enter your registered phone number"
              }
              value={resetContact}
              onChange={(e) => setResetContact(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              Send Reset Link
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            <button
              className="text-blue-500 hover:underline font-semibold"
              onClick={() => setForgotPasswordMode(false)}
            >
              Back to Login
            </button>
          </p>
        </>
      )}
    </div>
  </div>
);
}
