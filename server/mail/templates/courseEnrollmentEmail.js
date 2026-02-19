exports.courseEnrollmentEmail=(courseName,name)=>{
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        *{
            padding: 0;
            margin: 0;
            box-sizing: border-box;
            font-family: Arial,sans-serif;
            
        }

        body{
            background-color: #ffff;
            font-size: 16px;
            line-height: 1.4;
            /* color:#3333; */
            color:black;
            margin: 0;
            padding: 0;
        }

        .container{
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }

        .logo{
            max-width: 200px;
            margin-bottom: 20px;
        }   

        .logo h1{
            font-family: 1;
        }

        .message{
            font-size:18px;
            font-weight: bold;
            margin-bottom: 20px;  
        }

        .body{
            font-size: 16px;
            margin-bottom: 20px;
        }

        .cta{
            display: inline-block;
            padding:10px 20px;
            background-color: #FFD60A;
            color:black;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            margin-top: 20px;
        }

        .support{
            font-size: 14px;
            color:#9999;
            margin-top: 20px;
        }

        .highlight{
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="container">
        <a href="https://studynotion-edtech-project.vercel.app"><img class="logo" src="https://i.ibb.co/7Xyj" 
           alg="StudyNotion Logo" /></a>
           <div class="message">Course Registration Confirmation</div>
           <div class="body">
            <p>Dear ${name},</p>
            <p>You have Successfully Registered for the course <span class="highlight">${courseName}</span>.
           We are Excited to have you as a participant!</p>
           <p>Please Log in to your learning dashboard to access the course materials and start your learning journey</p>
           <a class="cta" href="https://studynotion-edtech-project.vercel.app/dashboard">Go to Dashboard</a>
           <p class="support">If you have any questions or need assistance.please feel free to reach out to us at <a href="mailto:info@studynotion.com">info@studynotion.com</a> we are here to help!</p>
           </div>
    </div>
</body>
</html>`
}