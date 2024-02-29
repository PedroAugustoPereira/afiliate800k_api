import * as crypto from "crypto";

export default function generateUniqueCode(email: string): string {
  const uniqueSring = email + Date.now().toString();
  const hash = crypto.createHash("md5").update(uniqueSring).digest("hex");

  return hash.substr(0, 5);
}
