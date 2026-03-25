export const studyNotionLogo =
  "https://res.cloudinary.com/djjqvm5wn/image/upload/v1774373011/logo_hgz270.png";
export const AnnouncementTemp = (title:string,message:string,instructorName:string) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      <style>
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-family: Arial, sans-serif;
          }
          body {
              background-color: #ffffff;
              color: #000;
              padding: 0;
              margin: 0;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 22px;
              text-align: center;
          }
          .logo {
              width: 140px;
              margin-bottom: 22px;
			  background-color: black;
			  padding:10px;
			  border-radius:5%;
			  border:none;
          }
          .message {
              font-size: 20px;
              font-weight: 700;
              margin-bottom: 18px;
              color: #5a2dff;
          }
          .body {
              font-size: 16px;
              margin-bottom: 22px;
              line-height: 1.5;
          }
          .support {
              font-size: 14px;
              color: #666;
              margin-top: 25px;
          }
          .support a {
              color: #5a2dff;
              font-weight: bold;
              text-decoration: none;
          }
      </style>
  </head>

  <body>
      <div class="container">
          <img class="logo" src="${studyNotionLogo}" alt="StudyNotion Logo" />
          <div class="message">${title}</div>

          <div class="body">
              <p>${message}</p>
              <p><strong>Instructor:</strong> ${instructorName}</p>
          </div>

          <div class="support">
              Need assistance? Contact us at
              <a href="mailto:studynotion.webapp@gmail.com">studynotion.webapp@gmail.com</a>
          </div>
      </div>
  </body>
  </html>`;
};
