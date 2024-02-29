import jwt, { SignOptions } from 'jsonwebtoken';

//payload são os dados passados e optiions como nome diz são opções adicionais
export const signJwt = (payload: Object, options: SignOptions = {}) => {
  //primeir pegamos nossa chave privada como string e transformamos ela em base64, para ainda mais segurança

  const privateKey = Buffer.from(
    /*config.get<string>("accessTokenPrivateKey"),*/
    process.env.ACCESS_TOKEN_PRIVATE_KEY,
    "base64"
  ).toString("ascii");

  //retornamos o token com o payload as options e com criptografia RS256
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
};

export const verifyJwt = <T>(token: string): T | null => {
  //esécificamos o timo de retorno de quem está chamando a função
  try {
    //pegamos a chave publica
    const publicKey = Buffer.from(process.env.ACCESS_TOKEN_PRIVATE_KEY,
      // config.get<string>("accessTokenPublicKey"),
      "base64"
    ).toString("ascii");

    //retornamos o sucesso ou não da verificação
    return jwt.verify(token, publicKey) as T;
  } catch (error) {
    return null;
  }
};
