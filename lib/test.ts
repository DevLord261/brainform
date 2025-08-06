import * as jose from "jose";

const secret = await jose.generateSecret("HS256", { extractable: true });
const exported = await jose.exportJWK(secret);

const base64 = Buffer.from("brainform");

const alg = "HS256";
const jwt = await new jose.SignJWT({ "urn:example:claim": true })
  .setProtectedHeader({ alg })
  .setIssuedAt()
  .setIssuer("urn:example:issuer")
  .setAudience("urn:example:audience")
  .setExpirationTime("2h")
  .sign(base64);

console.log(jwt);
