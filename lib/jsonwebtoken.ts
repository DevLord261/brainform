import * as jose from "jose";

class JwtService {
  private static instance: JwtService;
  private secret = Buffer.from(process.env.JWT_SECRET);

  public static getInstance(): JwtService {
    if (!JwtService.instance) {
      JwtService.instance = new JwtService();
    }
    return JwtService.instance;
  }

  public async GenerateToken(fullname: string) {
    const alg = "HS256";
    const jwt = await new jose.SignJWT({ "urn:example:claim": true })
      .setSubject(fullname)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setIssuer("brainkets:issuer")
      .setAudience("brainform")
      .setExpirationTime("1d")
      .sign(this.secret);
    return jwt;
  }

  public async VerifyToken(token: string) {
    try {
      const { payload } = await jose.jwtVerify(token, this.secret, {
        issuer: "brainkets:issuer",
        audience: "brainform",
      });
      return payload;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}

export default JwtService;
