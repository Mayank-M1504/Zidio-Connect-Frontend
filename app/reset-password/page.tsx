"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    const res = await fetch("http://localhost:8080/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword, confirmPassword }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setMessage(data.message || "Password reset successful!");
      setError("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setError(data.message || "Error resetting password.");
      setMessage("");
    }
  };

  if (!token) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Invalid or missing token</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">The password reset link is invalid or expired.</p>
          <Button className="mt-6 w-full" onClick={() => router.push("/auth")}>Back to Login</Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <Card className="rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom duration-500 relative overflow-hidden">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">Z</span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Reset Password</CardTitle>
            <p className="text-gray-600 mt-2">Enter your new password below</p>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {message && (
              <Alert className="mb-4">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <Input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
            <div className="text-center mt-6">
              <Button variant="link" onClick={() => router.push("/auth")} className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 