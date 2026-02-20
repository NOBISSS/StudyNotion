import { CTAButton } from "../HomePage/Button"
import { HighlightText } from "../HomePage/HighlightText"

export const LearningGrid=()=>{
    const AboutData1=[
    {
        order:-1,
        title:"World-Class Learning For ",
        highlightText:"Anyone,Anywhere",
        description:"Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.",
        BtnText:"Learn More",
        BtnLink:"/",
    },
    {
        order:1,
        title:"Curriculum Based on Industry Needs",
        description:"Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs."
    },
    {
        order:2,
        title:"Our Learning Methods",
        description:"Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs."
    },
    {
        order:3,
        title:"Certification",
        description:"Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs."
    },
    {
        order:4,
        title:'Rating "Auto-Grading"',
        description:"Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs."
    },
    {
        order:5,
        title:"Ready to Work",
        description:"Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs."
    },
]
    return(
        <div className="grid mx-auto grid-col-1 lg:grid-cols-4 mb-10 mt-20 p-10">
            {
                AboutData1.map((card,index)=>{
                    return (
                        <div
                        key={index}
                        className={`${index === 0 && "lg:col-span-2"}
                        ${
                            card.order % 2===0 ? "bg-[#161D29]" : "bg-[#2C333F] lg:h-[250px]"
                        }
                        ${ 
                            card.order === 3 && "lg:col-start-2"
                        }
                        lg:h-[250px]
                        `}>
                            {
                                card.order < 0 ? (
                                    <div className="bg-[#000814] h-[250px] flex flex-col px-25 gap-3">
                                        
                                            <h1 className="text-4xl font-semibold">{card.title}
                                            <HighlightText text={card.highlightText}/></h1>
                                        
                                        <p className="w-1/1 mb-4">
                                            {card.description}
                                        </p>
                                        <div>
                                        <div className="w-1/3">
                                        <CTAButton active={true} linkto={card.BtnLink}>
                                            {card.BtnText}
                                            </CTAButton>
                                        </div>
                                        </div>
                                    </div>
                                ) : (
                                <div className="w-1/1 flex flex-col p-6 px-10">
                                    <h1 className="text-[20px] text-white font-normal">{card.title}</h1><br></br>
                                    <p className="text-[#AFB2BF]">{card.description}</p>
                                </div>)
                            }
                        </div>
                    )
                })
            }           
        </div>
    )
}