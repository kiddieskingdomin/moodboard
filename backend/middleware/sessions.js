import crypto from 'node:crypto';

const COOKIE_NAME = process.env.SID_COOKIE_NAME || 'kk_sid';

export function sessionCookie(req, res, next) {
  let sid = req.cookies?.[COOKIE_NAME];
  if (!sid) {
    sid = crypto.randomUUID();
    // 14 days
    res.cookie(COOKIE_NAME, sid, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 14 * 24 * 3600 * 1000,
      secure: process.env.NODE_ENV === 'production'
    });
  }
  req.sessionId = sid;
  next();
}
