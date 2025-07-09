import { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [step, setStep] = useState(1); // 1 = form, 2 = OTP
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [enteredOTP, setEnteredOTP] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();

    // Simulate backend OTP generation
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otp);
    setStep(2);

    // Simulate "sending" OTP
    alert(`A verification code (OTP) has been sent to ${formData.email}: ${otp}`);
  };

  const handleOTPSubmit = (e) => {
    e.preventDefault();
    if (enteredOTP === generatedOTP) {
      setIsVerified(true);
      alert("Signup successful! You may now log in.");
    } else {
      alert("Incorrect OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        {step === 1 ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleFormChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number (optional)"
                value={formData.phone}
                onChange={handleFormChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleFormChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleFormChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold">
                Sign Up
              </button>
            </form>
            <div className="text-center mt-4 text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 font-semibold hover:underline">
                Login
              </Link>
            </div>
          </>
        ) : !isVerified ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Verify Email</h2>
            <form onSubmit={handleOTPSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={enteredOTP}
                onChange={(e) => setEnteredOTP(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold">
                Verify OTP
              </button>
            </form>
            <div className="text-center mt-4">
              <button
                onClick={handleSignupSubmit}
                className="text-sm text-blue-500 hover:underline"
              >
                Resend OTP
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center text-green-600">
              ✅ Email Verified!
            </h2>
            <p className="text-center mb-4">
              Your account has been successfully created.
            </p>
            <div className="text-center">
              <Link to="/login" className="text-blue-500 font-semibold hover:underline">
                Go to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
