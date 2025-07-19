import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

export default function ForgotResetFlow() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");


  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/reset-request", { email });
      toast.success(res.data.message || "OTP sent to email");
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };


  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/verify-reset-otp", { email, otp });
      toast.success(res.data.message || "OTP verified");
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/reset-password", {
        email,
        new_password: newPassword,
      });
      toast.success(res.data.message || "Password changed successfully");
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
            <form onSubmit={handleSendOTP} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600"
              >
                Send OTP
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <input
                type="text"
                placeholder="Enter OTP sent to your email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600"
              >
                Verify OTP
              </button>
            </form>
            <div className="text-sm text-center mt-2 text-gray-600">
              Didn't receive?{" "}
              <button onClick={handleSendOTP} className="text-blue-500 hover:underline">
                Resend
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Set New Password</h2>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
              >
                Change Password
              </button>
            </form>
          </>
        )}

        <div className="text-center mt-4">
          <Link to="/login" className="text-blue-500 hover:underline font-semibold">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
