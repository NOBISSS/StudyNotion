const Course=require("../Models/Course");
const {instance}=require("../Config/razorpay");
const User=require("../Models/User");
const mailSender=require("../Utils/MailSender");
const {courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail");

//capture the payment and initiate razorpay order
exports.capturePayment=async(req,res)=>{
    //get courseId and UserID
    const userId=req.user.id;
    const {courseId}=req.user;
    //validation
    //valid courseId
    if(!courseId){
        return res.json({
            success:false,
            message:"PLEASE PROVIDE VALID COURSE ID"
        })
    }
    //valid CourseDetail
    let course;
    try{
        course=await Course.findById(courseId);
        if(!course){
            return res.json({
                success:false,
                message:"COULD NOT FIND THE COURSE"
            })
        }
        //user Already Pay for the same course
        //converting string id to an object id
        const uid=new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success:false,
                message:"STUDENT IS ALREADY ENROLLED"
            })
        }
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"INTERNAL SERVER ERROR",
            error:error.message
        })
    }

    //order create 
    const amount=course.price;
    const currency="INR";
    const options={
        amount:amount*100,
        currency,
        receipt:Math.random(Date.now()).toString(),
        notes:{
            courseId,
            userId
        }
    };

    try{
        //initiate the payment using the razorpay
        const paymentResponse=await instance.orders.create(options);
        console.log(paymentResponse);
        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            courseThumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount
        })
    }catch(error){
        console.log(error)
        return res.json({
            success:false,
            message:error.message
        })
    }
};

//verifiy signature of Razorpay and server
exports.verfiySignature=async(req,res)=>{
    try{
        const webHookSecret="12345678";
        const signature=req.headers["x-razorpay-signature"];//behavior of razorpay
        //Hasedbased message authentication code
        const shasum=crypto.createHmac("sha256",webHookSecret)
        shasum.update(JSON.stringify(req.body));
        const digest=shasum.digest("hex");

        if(signature === digest){
            console.log("Payment is Authorizsed");

            const {courseId,userId}=req.body.payload.payment.entity.notes;
            
            try{
                //fulfuill the action
                
                //find the course and enroll the student in it
                const enrolledCourse=await Course.findOne(
                    {_id:courseId},
                    {$push:{studentsEnrolled:userId}},
                    {new:true}
                );

                if(!enrolledCourse){
                    return res.json({
                        success:false,
                        message:"Course Not Found",
                    });
                }

                console.log(enrolledCourse);
                //find the student and add courseId in courses
                const enrolledStudent=await User.findOne(
                                  {_id:userId},
                                  {$push:{courses:courseId}},
                                  {new:true}
                );

                console.log(enrolledStudent);

                //mail send krdo confirmation wala
                const emailReponse=await mailSender(
                    enrolledStudent.email,
                    "Congratulations From StudyNotion",
                    "Congratulations,you are onboarded into new StudyNotion Course",
                );

                console.log(emailReponse);
                return res.status(200).json({
                    success:true,
                    message:"Signature Verfied and Course Added"
                 })
            }
            catch(error){
                console.log(error);
                return res.json({
                    success:false,
                    message:error.message
                })
            }

        }else{
            return res.status(400).json({
                success:false,
                message:"invalid Secret"
            })
        }
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

