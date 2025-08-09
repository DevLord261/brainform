export interface User {
  id: string;
  email: string;
  fullname: string;
  created_at: Date;
}

export interface AuthState {
  user: User | null | string | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  fullname: string;
  email: string;
  password: string;
}

export interface VerifyOTPCredentials {
  email: string;
  otp: string;
}

class AuthService {
  constructor() {}

  async login(
    credentials: LoginCredentials,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const result = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Important!
        },
        body: JSON.stringify(credentials),
      });
      if (!result.ok)
        return { success: false, error: "Wrong email or password" };

      const user = await result.json();
      return { success: true, user: user.user };
    } catch (err) {
      return { success: false, error: "" + err };
    }
  }

  async signup(
    credentials: SignupCredentials,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Important!
        },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) return { success: false, error: "Email Already exists" };
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // In a real app, send OTP via email
      console.log(`OTP for ${credentials.email}: ${otp}`);

      return { success: true };
    } catch (e) {
      return { success: false, error: "" + e };
    }
  }

  async verifyOTP(
    credentials: VerifyOTPCredentials,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    if (!credentials.email) {
      return { success: false, error: "User not found" };
    }

    return { success: true };
  }

  async resendOTP(
    email: string,
  ): Promise<{ success: boolean; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    if (!email) {
      return { success: false, error: "User not found" };
    }

    // if (user.isVerified) {
    //   return { success: false, error: "User is already verified" };
    // }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log(`New OTP for ${email}: ${otp}`);

    return { success: true };
  }

  async getCurrentUser(): Promise<User | null> {
    if (typeof window === "undefined") return null;

    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) return null;

    const userId = this.sessions.get(sessionId);
    if (!userId) return null;

    const user = Array.from(this.users.values()).find((u) => u.id === userId);
    if (!user) return null;

    const { password, otp, otpExpiry, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async logout(): Promise<void> {
    if (typeof window === "undefined") return;

    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      this.sessions.delete(sessionId);
      localStorage.removeItem("sessionId");
    }
  }
}

export const authService = new AuthService();
