// "use server"
// import { SignJWT, jwtVerify } from 'jose'
// import { cookies } from 'next/headers'
// import { redirect } from 'next/navigation'
// const secretKey = process.env.SESSION_SECRET
// const encodedKey = new TextEncoder().encode(secretKey)

// export async function encrypt(payload: any) {
//   return new SignJWT(payload)
//     .setProtectedHeader({ alg: 'HS256' })
//     .setIssuedAt()
//     .setExpirationTime('1d')
//     .sign(encodedKey)
// }

// export async function decrypt(session: string | undefined = '') {
//   try {
//     const { payload } = await jwtVerify(session, encodedKey, {
//       algorithms: ['HS256'],
//     })
//     return payload
//   } catch (error) {
//     console.error('Failed to verify session', error)
//   }
// }

// export async function createSession(username: string, roles:string) {
//   const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
//   const session = await encrypt({ username, roles, expiresAt })

// //   cookies().set('session', session, {
// //     httpOnly: true,
// //     // secure: true,
// //     expires: expiresAt,
// //     sameSite: 'lax',
// //     path: '/',
// //   })
// // }

// cookies().set('session', session, {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === 'production',
//   expires: expiresAt,
//   sameSite: 'lax',
//   path: '/',
// })
// }

// export async function updateSession() {
//   const session = cookies().get('session')?.value
//   const payload = await decrypt(session)

//   if (!session || !payload) {
//     return null
//   }

//   const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
// //   cookies().set('session', session, {
// //     httpOnly: true,
// //     // secure: true,
// //     expires: expires,
// //     sameSite: 'lax',
// //     path: '/',
// //   })
// // }

// cookies().set('session', session, {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === 'production',
//   expires: expiresAt,
//   sameSite: 'lax',
//   path: '/',
// })
// }

// export async function deleteSession() {
//   cookies().delete('session')
//   redirect("/")
// }


// "use server";
// import { SignJWT, jwtVerify } from "jose";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

// const secretKey = process.env.SESSION_SECRET;
// if (!secretKey) {
//   throw new Error("SESSION_SECRET is not defined in environment variables");
// }
// const encodedKey = new TextEncoder().encode(secretKey);

// export async function encrypt(payload: any) {
//   return new SignJWT(payload)
//     .setProtectedHeader({ alg: "HS256" })
//     .setIssuedAt()
//     .setExpirationTime("1d")
//     .sign(encodedKey);
// }

// export async function decrypt(session: string | undefined = "") {
//   try {
//     const { payload } = await jwtVerify(session, encodedKey, {
//       algorithms: ["HS256"],
//     });
//     return payload;
//   } catch (error) {
//     console.error("Failed to verify session", error);
//     return null;
//   }
// }

// export async function createSession(username: string, roles: string) {
//   const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
//   const session = await encrypt({ username, roles, expiresAt });

//   cookies().set('session', session, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax", // Explicitly use the correct type
//     path: "/",
//     expires: expiresAt,
//   });
// }

// export async function updateSession() {
//   const session = cookies().get("session")?.value;
//   const payload = await decrypt(session);

//   if (!session || !payload) {
//     return null;
//   }

//   const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
//   cookies().set('session', session, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax", // Explicitly use the correct type
//     path: "/",
//     expires: expiresAt,
//   });
// }

// export async function deleteSession() {
//   cookies().delete('session')
//   redirect("/")
// }



// export async function deleteSession() {
//   cookies().delete("session", { path: "/" });
//   redirect("/");
// }


"use server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  throw new Error("SESSION_SECRET is not defined in environment variables");
}
const encodedKey = new TextEncoder().encode(secretKey);

// Encrypt the payload into a JWT token
export async function encrypt(payload: Record<string, any>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(encodedKey);
}

// Decrypt and verify the JWT token
export async function decrypt(session: string | undefined = ""): Promise<Record<string, any> | null> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error("Failed to verify session", error);
    return null;
  }
}

// Create a new session and set it as a cookie
export async function createSession(username: string, roles: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day expiry
  const session = await encrypt({ username, roles, expiresAt });

  cookies().set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

// Update the session's expiration
export async function updateSession(): Promise<void | null> {
  const session = cookies().get("session")?.value;
  if (!session) {
    console.warn("No session found to update");
    return null;
  }

  const payload = await decrypt(session);
  if (!payload) {
    console.warn("Invalid session, cannot update");
    return null;
  }

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Extend expiry
  cookies().set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

// Delete the session cookie and redirect to the home page
export async function deleteSession(): Promise<void> {
  cookies().delete("session");
  redirect("/");
}
