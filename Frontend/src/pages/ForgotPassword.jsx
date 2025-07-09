import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [method, setMethod] = useState("email");
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Reset link will be sent via ${method}: ${value}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="method"
                value="email"
                checked={method === "email"}
                onChange={() => setMethod("email")}
                className="mr-2"
              />
              Email
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="method"
                value="phone"
                checked={method === "phone"}
                onChange={() => setMethod("phone")}
                className="mr-2"
              />
              Phone
            </label>
          </div>
          <input
            type={method === "email" ? "email" : "tel"}
            placeholder={`Enter your ${method}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold">
            Send Reset Link
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/login" className="text-blue-500 hover:underline font-semibold">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
