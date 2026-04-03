export const coursePublishedTemplate = ({ firstName, courseName, courseUrl, thumbnailUrl, }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#0F1117;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0F1117;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
          style="background:#161D29;border-radius:12px;overflow:hidden;border:1px solid #2C333F;">

          <!-- Header -->
          <tr>
            <td style="background:#FFD60A;padding:24px 32px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#0F1117;">StudyNotion</p>
              <p style="margin:4px 0 0;font-size:13px;color:#0F1117;opacity:0.7;">
                Learn Smarter. Teach Better.
              </p>
            </td>
          </tr>

          ${thumbnailUrl ? `
          <tr>
            <td style="padding:0;">
              <img src="${thumbnailUrl}" alt="${courseName}"
                style="width:100%;height:200px;object-fit:cover;display:block;" />
            </td>
          </tr>` : ''}

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;font-size:14px;color:#838894;">
                Hey ${firstName},
              </p>
              <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#F1F2FF;line-height:1.3;">
                A course on your wishlist just went live! 🎉
              </h1>
              <p style="margin:0 0 8px;font-size:15px;color:#FFD60A;font-weight:600;">
                ${courseName}
              </p>
              <p style="margin:0 0 28px;font-size:14px;color:#AFB2BF;line-height:1.6;">
                The course you wishlisted is now published and ready for you to start learning.
                Don't miss out — enroll now and begin your journey.
              </p>
              <a href="${courseUrl}"
                style="display:inline-block;background:#FFD60A;color:#0F1117;text-decoration:none;
                       font-weight:700;font-size:15px;padding:14px 32px;border-radius:8px;">
                View Course →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #2C333F;">
              <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.6;">
                You received this email because you wishlisted this course on StudyNotion.
                <br />
                © ${new Date().getFullYear()} StudyNotion. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
//# sourceMappingURL=coursePublishedTemplate.js.map