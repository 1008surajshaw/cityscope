import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.SECRET });
  const { pathname } = new URL(req.url);
   console.log(token,"token in middleware");
   if(pathname === '/posts/liked'){
    if(!token){
      return NextResponse.redirect(new URL('/', req.url));
    }
   }
   if(pathname === '/posts/commented'){
    if(!token){
      return NextResponse.redirect(new URL('/', req.url));
    }
   }
   if(pathname === '/posts/:postId' ){
    if(!token){
      return NextResponse.redirect(new URL('/', req.url));
    }
   }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
