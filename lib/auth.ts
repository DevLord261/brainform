export interface User {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface VerifyOTPCredentials {
  email: string;
  otp: string;
}

// Mock auth service - in a real app, this would connect to your backend
class AuthService {
  private users: Map<
    string,
    User & { password: string; otp?: string; otpExpiry?: Date }
  > = new Map();
  private sessions: Map<string, string> = new Map(); // sessionId -> userId

  constructor() {
    // Add a demo user
    this.users.set("demo@example.com", {
      id: "demo-user-1",
      email: "demo@example.com",
      name: "Demo User",
      password: "password123",
      isVerified: true,
      createdAt: new Date(),
    });
  }

  async login(
    credentials: LoginCredentials,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    const user = this.users.get(credentials.email);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (user.password !== credentials.password) {
      return { success: false, error: "Invalid password" };
    }

    if (!user.isVerified) {
      return { success: false, error: "Please verify your email first" };
    }

    const sessionId = crypto.randomUUID();
    this.sessions.set(sessionId, user.id);

    // Store session in localStorage (in a real app, use httpOnly cookies)
    if (typeof window !== "undefined") {
      localStorage.setItem("sessionId", sessionId);
    }

    const { password, otp, otpExpiry, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  }

  async signup(
    credentials: SignupCredentials,
  ): Promise<{ success: boolean; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    if (this.users.has(credentials.email)) {
      return { success: false, error: "User already exists" };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = {
      id: crypto.randomUUID(),
      email: credentials.email,
      name: credentials.name,
      password: credentials.password,
      isVerified: false,
      createdAt: new Date(),
      otp,
      otpExpiry,
    };

    this.users.set(credentials.email, user);

    // In a real app, send OTP via email
    console.log(`OTP for ${credentials.email}: ${otp}`);

    return { success: true };
  }

  async verifyOTP(
    credentials: VerifyOTPCredentials,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    const user = this.users.get(credentials.email);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (!user.otp || !user.otpExpiry) {
      return { success: false, error: "No OTP found" };
    }

    if (new Date() > user.otpExpiry) {
      return { success: false, error: "OTP has expired" };
    }

    if (user.otp !== credentials.otp) {
      return { success: false, error: "Invalid OTP" };
    }

    // Mark user as verified and clear OTP
    user.isVerified = true;
    delete user.otp;
    delete user.otpExpiry;

    const sessionId = crypto.randomUUID();
    this.sessions.set(sessionId, user.id);

    if (typeof window !== "undefined") {
      localStorage.setItem("sessionId", sessionId);
    }

    const { password, otp, otpExpiry, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  }

  async resendOTP(
    email: string,
  ): Promise<{ success: boolean; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    const user = this.users.get(email);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (user.isVerified) {
      return { success: false, error: "User is already verified" };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;

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
