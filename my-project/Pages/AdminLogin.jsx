
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Eye, EyeOff } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("http://localhost:5000/api/auth/admin/login", {
        username: email,
        password,
      })

      localStorage.setItem("adminToken", response.data.token)
      navigate("/report")
    } catch (err) {
      alert(err.response?.data?.error || "Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-gray-200/30 to-gray-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-gray-100/30 to-gray-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-800 to-black rounded-3xl mb-6 shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Admin Portal
          </h1>
          <p className="text-gray-600 mt-3 text-lg">Sign in to access your dashboard</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-xl relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 via-gray-400/10 to-gray-500/10 rounded-xl" />

          <form onSubmit={handleLogin} className="relative z-10">
            <CardHeader className="space-y-1 pb-8">
              <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Welcome back
              </CardTitle>
              <CardDescription className="text-center text-gray-600 text-base">
                Enter your credentials to continue
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              <div className="space-y-6">
                {/* Email Input */}
                <div className="space-y-3">
                  <Label htmlFor="email">UserName</Label>
                  <Input
                    id="text"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="abcde"
                    required
                    className="h-12 bg-white/70 border-gray-200 focus:border-gray-400 focus:ring-gray-400/20 focus:ring-4 rounded-xl"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="h-12 pr-12 bg-white/70 border-gray-200 focus:border-gray-400 focus:ring-gray-400/20 focus:ring-4 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 bg-gradient-to-r from-gray-800 to-black text-white font-semibold rounded-xl hover:from-gray-900 hover:to-gray-800">
                  Sign in to dashboard
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  )
}
