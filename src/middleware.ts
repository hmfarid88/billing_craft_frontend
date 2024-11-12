
// import { NextRequest, NextResponse } from 'next/server'
// import { decrypt } from '@/app/lib/auth'
// import { cookies } from 'next/headers'
 
// // 1. Specify protected and public routes
// const protectedRoutes = ['/dashboard', '/purchase']
// const publicRoutes = ['/']
 
// export default async function middleware(req: NextRequest) {
//   // 2. Check if the current route is protected or public
//   const path = req.nextUrl.pathname
//   const isProtectedRoute = protectedRoutes.includes(path)
//   const isPublicRoute = publicRoutes.includes(path)
  
//   // 3. Decrypt the session from the cookie
//   const cookie = cookies().get('session')?.value
//   const session = await decrypt(cookie)
 
//   // 5. Redirect to /login if the user is not authenticated
//   if (isProtectedRoute && !session?.username) {
//     return NextResponse.redirect(new URL('/', req.nextUrl))
//   }
 
//   // 6. Redirect to /dashboard if the user is authenticated
//   if (
//     isPublicRoute &&
//     session?.username &&
//     !path.startsWith('/dashboard')
//   ) {
//     return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
//   }
   
//   return NextResponse.next()
// }
 
// // Routes Middleware should not run on
// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// }



// solution 02

import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/app/lib/auth'
import { cookies } from 'next/headers'

const adminProtectedRoutes = [''];
const userProtectedRoutes = [''];
const publicRoutes = ['/'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isAdminProtectedRoute = adminProtectedRoutes.includes(path);
  const isUserProtectedRoute = userProtectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const cookie = cookies().get('session')?.value;
  
  // Handle missing cookie
  if (!cookie) {
    if (isAdminProtectedRoute || isUserProtectedRoute) {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
    return NextResponse.next();
  }

  const session = await decrypt(cookie);

  // If decryption fails or userId is missing, redirect to login for protected routes
  if (isAdminProtectedRoute || isUserProtectedRoute && !session?.username) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  if (session?.username) {
    try {
      const res = await fetch(`${apiBaseUrl}/auth/user/userRole?name=${session.username}`);
      const user = await res.json();

      if (isPublicRoute) {
        if (user.roles === 'ROLE_ADMIN' && !req.nextUrl.pathname.startsWith('/admin-dashboard')) {
          return NextResponse.redirect('/admin-dashboard');
        }
        if (user.roles === 'ROLE_USER' && !req.nextUrl.pathname.startsWith('/dashboard')) {
          return NextResponse.redirect('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      // Handle error accordingly, maybe log it or notify admin
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

// solution 03


// import { NextRequest, NextResponse } from 'next/server';
// import { decrypt } from '@/app/lib/auth';
// import { cookies } from 'next/headers';

// const adminProtectedRoutes = ['/admin-dashboard'];
// const userProtectedRoutes = ['/purchase'];
// const publicRoutes = ['/'];

// export default async function middleware(req: NextRequest) {
//   const path = req.nextUrl.pathname;
//   const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

//   const isAdminProtectedRoute = adminProtectedRoutes.includes(path);
//   const isUserProtectedRoute = userProtectedRoutes.includes(path);
//   const isPublicRoute = publicRoutes.includes(path);

//   const cookie = cookies().get('session')?.value;

//   // Handle missing cookie
//   if (!cookie) {
//     if (isAdminProtectedRoute || isUserProtectedRoute) {
//       return NextResponse.redirect(new URL('/', req.nextUrl));
//     }
//     return NextResponse.next();
//   }

//   try {
//     const session = await decrypt(cookie);

//     // If decryption fails or userId is missing, redirect to login for protected routes
//     if ((isAdminProtectedRoute || isUserProtectedRoute) && !session?.username) {
//       return NextResponse.redirect(new URL('/', req.nextUrl));
//     }

//     if (session?.username) {
//       const res = await fetch(`${apiBaseUrl}/auth/user/userRole?name=${session.username}`);
      
//       if (!res.ok) {
//         throw new Error('Failed to fetch user role');
//       }

//       const user = await res.json();

//       if (isUserProtectedRoute && user.roles !== 'ROLE_USER') {
//         return NextResponse.redirect(new URL('/', req.nextUrl));
//       }

//       if (isAdminProtectedRoute && user.roles !== 'ROLE_ADMIN') {
//         return NextResponse.redirect(new URL('/', req.nextUrl));
//       }

//       if (isPublicRoute) {
//         if (user.roles === 'ROLE_ADMIN' && !req.nextUrl.pathname.startsWith('/admin-dashboard')) {
//           return NextResponse.redirect(new URL('/admin-dashboard', req.nextUrl));
//         }
//         if (user.roles === 'ROLE_USER' && !req.nextUrl.pathname.startsWith('/dashboard')) {
//           return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
//         }
//       }
//     }
//   } catch (error) {
//     console.error('Error in middleware:', error);
//     // Consider adding more robust error handling here
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// };



// import { NextRequest, NextResponse } from 'next/server'
// import { decrypt } from '@/app/lib/auth'
// import { cookies } from 'next/headers'

// const adminProtectedRoutes = ['/admin-dashboard'];
// const userProtectedRoutes = ['/dashboard', '/purchase'];
// const publicRoutes = ['/'];

// async function getUserRole(username: string, apiBaseUrl: string) {
//   try {
//     const res = await fetch(`${apiBaseUrl}/auth/user/userRole?name=${username}`);
//     if (!res.ok) {
//       throw new Error(`Failed to fetch user role: ${res.statusText}`);
//     }
//     const user = await res.json();
//     return user.roles;
//   } catch (error) {
//     console.error('Error fetching user role:', error);
//     return null;
//   }
// }

// export default async function middleware(req: NextRequest) {
//   const path = req.nextUrl.pathname;
//   const isAdminProtectedRoute = adminProtectedRoutes.includes(path);
//   const isUserProtectedRoute = userProtectedRoutes.includes(path);
//   const isPublicRoute = publicRoutes.includes(path);
//   const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

//   const sessionCookie = cookies().get('session')?.value;

//   if (!sessionCookie) {
//     if (isAdminProtectedRoute || isUserProtectedRoute) {
//       return NextResponse.redirect(new URL('/', req.nextUrl));
//     }
//     return NextResponse.next();
//   }

//   const session = await decrypt(sessionCookie);

//   if (!session?.username) {
//     if (isAdminProtectedRoute || isUserProtectedRoute) {
//       return NextResponse.redirect(new URL('/', req.nextUrl));
//     }
//     return NextResponse.next();
//   }

//   const userRole = await getUserRole(session.username, apiBaseUrl);

//   if (isAdminProtectedRoute && userRole !== 'ROLE_ADMIN') {
//     return NextResponse.redirect(new URL('/', req.nextUrl));
//   }

//   if (isUserProtectedRoute && userRole !== 'ROLE_USER') {
//     return NextResponse.redirect(new URL('/', req.nextUrl));
//   }

//   if (isPublicRoute) {
//     if (userRole === 'ROLE_ADMIN' && !req.nextUrl.pathname.startsWith('/admin-dashboard')) {
//       return NextResponse.redirect('/admin-dashboard');
//     }
//     if (userRole === 'ROLE_USER' && !req.nextUrl.pathname.startsWith('/dashboard')) {
//       return NextResponse.redirect('/dashboard');
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// };



