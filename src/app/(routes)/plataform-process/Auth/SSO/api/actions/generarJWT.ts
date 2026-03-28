"use server";

import jwt from "jsonwebtoken";

/**
 * Genera un token JWT (SSO) asíncronamente
 */
export async function generarJWT(
  user_id: string | number,
  username: string = "",
  email: string = "",
  refresh_token: string = "",
  system_id: string | number = "",
): Promise<string> {
  return new Promise((resolve, reject) => {
    const payload = { user_id, username, email, refresh_token, system_id };

    const secret = process.env.API_KEY_IAM || "";
    if (!secret) {
      return reject("API_KEY_IAM no está configurada");
    }

    jwt.sign(
      payload,
      secret,
      {
        expiresIn: "1m",
      },
      (err, token) => {
        if (err || !token) {
          reject("No se pudo generar el token");
        } else {
          resolve(token);
        }
      },
    );
  });
}

/**
 * Acción principal llamada desde el Dashboard
 */
export async function generateLocalSSOTokenAction(payload: {
  user_id: string | number;
  username: string;
  email: string;
  refresh_token: string;
  system_id: string | number;
}): Promise<string> {
  return await generarJWT(
    payload.user_id,
    payload.username,
    payload.email,
    payload.refresh_token,
    payload.system_id,
  );
}
